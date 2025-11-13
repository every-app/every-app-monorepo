import { execWithIndentedOutput } from "./formatting";

/**
 * Clone a git repository to a target directory
 * @param url - The git repository URL
 * @param targetDir - The directory to clone into
 * @param verbose - Whether to show detailed output
 */
export async function cloneRepository(
  url: string,
  targetDir: string,
  verbose: boolean = false,
): Promise<void> {
  try {
    await execWithIndentedOutput("git", ["clone", url, targetDir], {
      stdio: "inherit",
      verbose,
    });
  } catch (error) {
    throw new Error(
      `Failed to clone repository from ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
