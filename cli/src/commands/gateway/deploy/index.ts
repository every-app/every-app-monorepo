import type { LocalContext } from "@/context";
import chalk from "chalk";
import path from "node:path";
import {
  setupCloudflareResources,
  cloneAndInstall,
  updateConfigAndDeploy,
} from "@/commands/gateway/deploy/cloudflareDeployment";
import type { DeployCommandFlags } from "@/commands/gateway/deploy/types";
import {
  cleanupTempDirectory,
  createTempDirectory,
} from "@/lib/file-operations";
import { getWorkerName } from "@/lib/wrangler-config";
import { confirmDeployment } from "@/lib/deployment";
import { getWorkerUrl } from "@/lib/cloudflare-auth";

export async function deploy(
  this: LocalContext,
  flags: DeployCommandFlags,
): Promise<void> {
  const verbose = flags.verbose || false;

  // Step 1: Confirm deployment
  const confirmed = await confirmDeployment(
    "Do you want to deploy EveryApp Gateway into this Cloudflare account?",
  );
  if (!confirmed) {
    console.log(chalk.red("\nDeployment cancelled by user\n"));
    return;
  }

  // Step 2: Set up Cloudflare resources
  const resources = await setupCloudflareResources();

  // Step 3: Clone and install (we need this to read the worker name from wrangler.jsonc)
  const tmpDir = await createTempDirectory("gateway-deploy-");
  console.log(chalk.dim(`\nWorking directory: ${tmpDir}\n`));

  let workerUrl = null;
  try {
    const gatewayPath = await cloneAndInstall(tmpDir, verbose);

    // Step 4: Predict worker URL
    console.log(chalk.bold("Determining worker URL...\n"));
    const wranglerConfigPath = path.join(gatewayPath, "wrangler.jsonc");
    const workerName = await getWorkerName(wranglerConfigPath);
    workerUrl = await getWorkerUrl(workerName);
    console.log(chalk.green(`Worker will be deployed to: ${workerUrl}\n`));

    // Step 5: Update config and deploy (secrets are set inside this function after vars are removed)
    await updateConfigAndDeploy(gatewayPath, resources, workerUrl, verbose);
  } catch (error) {
    console.error(
      chalk.red("\nDeployment failed:"),
      error instanceof Error ? error.message : error,
    );
    throw error;
  } finally {
    await cleanupTempDirectory(tmpDir, verbose);
  }

  if (!workerUrl)
    throw new Error("Worker URL not net properly during deployment");

  // Step 6: Show success message with URL
  console.log(chalk.bold.green("🎉 Gateway deployment successful!\n"));
  console.log(
    chalk.bold(`Your gateway is now live at: ${chalk.cyan(workerUrl)}\n`),
  );
  console.log(
    chalk.dim("Try it out by visiting the URL above in your browser.\n"),
  );
  console.log(
    chalk.yellow(
      "Note: if you see an error in the browser, cloudflare may still be setting up your domain. Wait ~1 minute to see if resolves itself.\n",
    ),
  );
}
