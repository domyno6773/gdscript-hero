'use strict';
require('./manual-course-native.test.cjs')({numbers:[216, 217, 218, 219, 220]}).catch(error=>{console.error(error);process.exitCode=1});
