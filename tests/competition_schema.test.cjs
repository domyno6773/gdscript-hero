'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase','migrations',
 '20261027_gdh_competition_foundation.sql'),'utf8');
for(const name of ['gdh_seasons','gdh_challenges','gdh_country_selections','gdh_attempts',
 'gdh_best_scores','gdh_verified_xp_events','gdh_entitlements','gdh_grading_fixtures']){
 assert.match(sql,new RegExp('CREATE TABLE IF NOT EXISTS (?:public|gdh_private)\\.'+name+'\\b'));
 assert.match(sql,new RegExp('ALTER TABLE (?:public|gdh_private)\\.'+name+' ENABLE ROW LEVEL SECURITY'));
}
for(const fn of ['gdh_confirm_country','gdh_my_premium','gdh_premium_archive',
 'gdh_record_verified_verdict','gdh_leaderboard']){
 assert.match(sql,new RegExp('CREATE OR REPLACE FUNCTION public\\.'+fn+'\\('));
}
assert.match(sql,/auth\.role\(\) IS DISTINCT FROM 'service_role'/);
assert.match(sql,/gdh_record_verified_verdict\(UUID,UUID,TEXT,INT,TEXT,INT\)[\s\S]*?TO service_role/);
assert.match(sql,/ON CONFLICT \(user_id,event_key\) DO NOTHING/);
assert.match(sql,/p_scope='global' OR cs\.country=v_country/);
assert.match(sql,/gdh_premium_archive[\s\S]*?gdh_my_premium/);
assert.doesNotMatch(sql,/GRANT\s+(?:ALL|INSERT|UPDATE|DELETE)\s+ON\s+public\.gdh_best_scores\s+TO\s+(?:anon|authenticated)/i);
console.log('Competition schema privilege and invariants checks passed (static, not DB integration).');
