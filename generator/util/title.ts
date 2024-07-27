
export function canonicalizeTitle(title: string | undefined): string | undefined {
  return substituteInTitle(stripTrailingDot(title));
}

export function stripTrailingDot(str: string | undefined): string | undefined {
  return str?.replace(/\.$/, "");
}

export function substituteInTitle(title: string|undefined): string|undefined {
  if (!title) {
    return title;
  }

  const replacements: [RegExp, string][] = [
    [/['`]([^`]+)['`]/g, "$1"],
    [/AppInstallation(s)?/, "app installation$1"],
    [/AppVersion(s)?/, "app version$1"],
    [/App(s)?/, "app$1"],
    [/DatabaseUser(s)?/, "database user$1"],
    [/MySQL-?Database(s)?/i, "MySQL database$1"],
    [/MySQLUser(s)?/i, "MySQL user$1"],
    [/MySQLVersion(s)?/i, "MySQL version$1"],
    [/RedisDatabase(s)?/i, "Redis database$1"],
    [/RedisVersion(s)?/i, "Redis database$1"],
    [/SystemSoftwareVersion(s)?/, "system software version$1"],
    [/SystemSoftware(s)?/, "system software$1"],
    [/ProjectBackupSchedule(s)?/, "project backup schedule$1"],
    [/BackupSchedule(s)?/, "backup schedule$1"],
    [/ProjectBackupExport(s)?/, "project backup export$1"],
    [/ProjectBackup(s)?/, "project backup$1"],
    [/CronjobExecution(s)?/, "cronjob execution$1"],
    [/Cronjob(s)?/, "cronjob$1"],
    [/CustomerInvite(s)?/, "customer invite$1"],
    [/CustomerMembership(s)?/, "customer membership$1"],
    [/DNSZone(s)?/, "DNS Zone$1"],
    [/DeliveryBox(es)?/, "delivery box$1"],
    [/MailAddress(es)?/, "mail address$1"],
    [/Email-?Address(es)?/, "mail address$1"],
    [/ExtensionInstance(s)?/, "extension instance$1"],
    [/Contributor(s)?/, "contributor$1"],
    [/SSHUser(s)?/, "SSH user$1"],
    [/SFTPUser(s)?/, "SFTP user$1"],
  ]

  for (const [pattern, replacement] of replacements) {
    title = title.replace(pattern, replacement);
  }

  return title;
}