import { accessChecks, fileChecks, homepageChecks, productChecks, summarize } from "./checks";
import { getFiles, getHome, getProbes, getProduct } from "./data";

// The pieces of a report, each awaited by the section that needs it. The
// fetchers are cached, so calling these from several components (and from
// the Open Graph image) only crawls the site once.

export async function loadHome(host: string) {
  return getHome(host);
}

export async function loadAccess(host: string) {
  const home = await getHome(host);
  if (!home.ok) return null;
  const [files, probes] = await Promise.all([getFiles(home.origin), getProbes(home.origin)]);
  return { home, files, probes, checks: accessChecks(home, files, probes) };
}

export async function loadFiles(host: string) {
  const home = await getHome(host);
  if (!home.ok) return null;
  const files = await getFiles(home.origin);
  return { home, files, checks: fileChecks(home, files) };
}

export async function loadProduct(host: string) {
  const home = await getHome(host);
  if (!home.ok) return null;
  const product = await getProduct(home.productUrl);
  return { home, product, checks: productChecks(home, product) };
}

export async function loadSummary(host: string) {
  const home = await getHome(host);
  if (!home.ok) return { home, summary: null };
  const [access, files, product] = await Promise.all([loadAccess(host), loadFiles(host), loadProduct(host)]);
  const checks = [...(access?.checks ?? []), ...(files?.checks ?? []), ...homepageChecks(home), ...(product?.checks ?? [])];
  return { home, summary: summarize(checks) };
}
