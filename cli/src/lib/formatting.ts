import { execa } from "execa";
import chalk from "chalk";

/**
 * Wraps execa call to show indented, dimmed output for shell commands
 */
export async function execWithIndentedOutput(
  command: string,
  args: string[],
  options: { cwd?: string; stdio?: string; env?: NodeJS.ProcessEnv; verbose?: boolean } = {},
) {
  const { env, cwd, verbose = false } = options;

  if (verbose) {
    console.log(chalk.dim(`  ┌─ Running: ${command} ${args.join(" ")}`));

    const subprocess = execa(command, args, {
      cwd,
      env,
      stdio: undefined,
      all: true,
    });

    // Stream and indent output in real-time
    if (subprocess.stdout) {
      subprocess.stdout.on("data", (chunk: Buffer) => {
        const lines = chunk.toString().split("\n");
        lines.forEach((line) => {
          if (line.trim()) console.log(chalk.dim(`  │ ${line}`));
        });
      });
    }

    if (subprocess.stderr) {
      subprocess.stderr.on("data", (chunk: Buffer) => {
        const lines = chunk.toString().split("\n");
        lines.forEach((line) => {
          if (line.trim()) console.error(chalk.dim(`  │ ${line}`));
        });
      });
    }

    const result = await subprocess;
    console.log(chalk.dim(`  └─ Complete\n`));
    return result;
  } else {
    // Non-verbose mode: just show the command being run
    console.log(`Running: ${command} ${args.join(" ")}`);

    const result = await execa(command, args, {
      cwd,
      env,
      stdio: "pipe", // Suppress output
    });

    return result;
  }
}
