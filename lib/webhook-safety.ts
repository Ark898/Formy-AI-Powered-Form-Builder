import { lookup } from "node:dns/promises";
import net from "node:net";
import { isPrivateHost, isSafeWebhookUrl } from "./security";

const blockedNetworks = new net.BlockList();

blockedNetworks.addSubnet("0.0.0.0", 8, "ipv4");
blockedNetworks.addSubnet("10.0.0.0", 8, "ipv4");
blockedNetworks.addSubnet("100.64.0.0", 10, "ipv4");
blockedNetworks.addSubnet("127.0.0.0", 8, "ipv4");
blockedNetworks.addSubnet("169.254.0.0", 16, "ipv4");
blockedNetworks.addSubnet("172.16.0.0", 12, "ipv4");
blockedNetworks.addSubnet("192.168.0.0", 16, "ipv4");
blockedNetworks.addSubnet("198.18.0.0", 15, "ipv4");
blockedNetworks.addSubnet("224.0.0.0", 4, "ipv4");
blockedNetworks.addSubnet("240.0.0.0", 4, "ipv4");

blockedNetworks.addSubnet("::", 128, "ipv6");
blockedNetworks.addSubnet("::1", 128, "ipv6");
blockedNetworks.addSubnet("fc00::", 7, "ipv6");
blockedNetworks.addSubnet("fe80::", 10, "ipv6");

function isBlockedIp(address: string): boolean {
  const mapped = address.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mapped) {
    return blockedNetworks.check(mapped[1], "ipv4");
  }

  const family = net.isIPv4(address) ? "ipv4" : "ipv6";
  return blockedNetworks.check(address, family);
}

/**
 * Returns a URL that is safe for the server to POST to, or null when the
 * target is not a public http(s) endpoint. Rejects DNS names that resolve to
 * loopback, private, link-local, or metadata addresses.
 */
export async function getSafeWebhookUrl(raw: string): Promise<URL | null> {
  if (!isSafeWebhookUrl(raw)) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");

  if (net.isIP(hostname) !== 0) {
    return isBlockedIp(hostname) ? null : url;
  }

  if (isPrivateHost(hostname)) return null;

  try {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    if (addresses.length === 0) return null;
    if (addresses.some(({ address }) => isBlockedIp(address))) return null;
  } catch {
    return null;
  }

  return url;
}
