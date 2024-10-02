export type GithubRelease = {
  published_at: string;
  html_url: string;
  body: string;
  name: string;
  tag_name: string;
};

export type GithubContentObject = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
} & ({
  type: "dir";
  entries: GithubContentObject[];
} | {
  type: "file";
})