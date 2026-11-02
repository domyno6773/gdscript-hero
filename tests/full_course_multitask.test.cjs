'use strict';
// Migrated contract: the published manifest now contains the 235-lesson manual.
// Keep behavior, persistence and grading assertions in the shared release suite.
require('./manual-release-regressions.test.cjs')(["curriculum", "content", "grading"]).catch(error=>{console.error(error);process.exitCode=1});
