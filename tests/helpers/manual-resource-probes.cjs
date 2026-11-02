'use strict';
// Exercise the resource loader directly, independently of curriculum grading.
const entry='main.gd';
const named=(base)=>({
 [entry]:'extends Node\nfunc _ready():\n    print(ManualAuditClass.next())',
 'probe.gd':'class_name ManualAuditClass\nextends RefCounted\nstatic var count: int = '+base+'\nstatic func next():\n    count += 1\n    return count'
});
module.exports=[
 {name:'preload-path',output:'41\ntrue',files:{
  [entry]:'extends Node\nconst Helper = preload("res://helper.gd")\nfunc _ready():\n    var helper = Helper.new()\n    print(helper.value())\n    print(helper.get_script().resource_path.ends_with("/helper.gd"))',
  'helper.gd':'extends RefCounted\nfunc value():\n    return 41'
 }},
 {name:'class-first',output:'11',files:named(10)},
 {name:'class-reloaded',output:'201',files:named(200)},
 {name:'absent-class-isolation',rejected:true,files:{
  [entry]:'extends Node\nfunc _ready():\n    print(ManualAuditClass.new())'
 }}
].map(p=>({...p,project:{entry,files:p.files}}));
