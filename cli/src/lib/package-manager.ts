import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { execWithIndentedOutput } from "./formatting";
import { execa } from "execa";

export type PackageManager = "pnpm" | "npm";

/**
 * Detect package manager based on lockfiles in directory
 * @param cwd - Directory to check for lockfiles
 * @returns Detected package manager or null if none found
 */
export async function detectPackageManager(
  cwd: string,
): Promise<PackageManager | null> {
  try {
    const files = await fs.readdir(cwd);

    if (files.includes("pnpm-lock.yaml")) {
      return "pnpm";
    }

    if (files.includes("package-lock.json")) {
      return "npm";
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a command is available in the system
 * @param command - Command to check
 * @returns True if command is available, false otherwise
 */
async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execa("which", [command]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Install dependencies using the specified package manager
 * @param packageManager - Package manager to use (pnpm or npm)
 * @param cwd - Directory to run installation in
 * @param verbose - Whether to show detailed output
 */
export async function installDependencies(
  packageManager: PackageManager,
  cwd: string,
  verbose: boolean = false,
): Promise<void> {
  try {
    // For pnpm, check if it's available globally, otherwise use npx
    if (packageManager === "pnpm") {
      const isPnpmAvailable = await isCommandAvailable("pnpm");

      if (!isPnpmAvailable) {
        await execWithIndentedOutput("npx", ["pnpm", "install"], {
          cwd,
          stdio: "inherit",
          verbose,
        });
        return;
      }
    }

    await execWithIndentedOutput(packageManager, ["install"], {
      cwd,
      stdio: "inherit",
      verbose,
    });
  } catch (error) {
    throw new Error(
      `Failed to install dependencies with ${packageManager}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Check if node_modules directory exists
 * @param cwd - Directory to check for node_modules
 * @returns True if node_modules exists, false otherwise
 */
export async function hasNodeModules(cwd: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(cwd, "node_modules"));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Install dependencies if node_modules doesn't exist
 * Automatically detects the package manager from lockfiles
 * @param cwd - Directory to check and install dependencies in
 * @param verbose - Whether to show detailed output
 */
export async function ensureDependencies(cwd: string, verbose: boolean = false): Promise<void> {
  const hasModules = await hasNodeModules(cwd);

  if (!hasModules) {
    console.log(chalk.bold("Installing dependencies...\n"));

    try {
      // Detect package manager from lock files
      const hasPnpmLock = await fs
        .access(path.join(cwd, "pnpm-lock.yaml"))
        .then(() => true)
        .catch(() => false);
      const hasNpmLock = await fs
        .access(path.join(cwd, "package-lock.json"))
        .then(() => true)
        .catch(() => false);

      const packageManager = hasPnpmLock ? "pnpm" : hasNpmLock ? "npm" : "pnpm";

      await installDependencies(packageManager, cwd, verbose);

      console.log(chalk.green("Dependencies installed\n"));
    } catch (error) {
      console.error(chalk.red("\nFailed to install dependencies"));
      throw error;
    }
  }
}
