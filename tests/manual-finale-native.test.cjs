'use strict';
require('./manual-course-native.test.cjs')({numbers:[221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235]}).catch(error=>{console.error(error);process.exitCode=1});
