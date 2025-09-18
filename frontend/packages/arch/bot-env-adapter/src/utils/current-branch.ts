/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { execSync } from 'child_process';

/**
 * Get the current git branch name
 * @Returns the current branch name, or undefined if not in the git repository or an error occurs
 */
export function getCurrentBranch(): string | undefined {
  // Prefer environment variables in CI / container builds
  const envBranch =
    process.env.BRANCH_NAME ||
    process.env.GIT_BRANCH ||
    process.env.CI_COMMIT_BRANCH ||
    process.env.GITHUB_REF_NAME ||
    process.env.BUILD_SOURCEBRANCHNAME ||
    '';

  if (envBranch.trim()) {
    return envBranch.trim();
  }

  // Allow disabling git calls via environment variable (e.g., in Docker builds)
  if (process.env.DISABLE_GIT === '1' || process.env.CI === 'true') {
    return '';
  }

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();
    if (branch === 'HEAD') return undefined;
    return branch;
  } catch (error) {
    return '';
  }
}
