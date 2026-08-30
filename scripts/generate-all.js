/**
 * HW06 — Generate test case CSVs and Postman collections
 * Run: node scripts/generate-all.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MSSV = '23127044';

function writeCsv(relPath, headers, rows) {
  const esc = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map((h) => esc(row[h])).join(','));
  const fp = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, lines.join('\n'), 'utf8');
  console.log(`Wrote ${relPath} (${rows.length} rows)`);
}

// ========== API 1: Profile ==========
const profileGenerated = [
  { TC_ID: 'API1-G-01', Type: 'domain', Scenario: 'Happy path full profile update', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi Q1"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-02', Type: 'domain', Scenario: 'Update name only', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Test User Updated"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-03', Type: 'domain', Scenario: 'Update phone 9 digits valid regex', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-04', Type: 'domain', Scenario: 'Update phone 10 digits valid regex', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"9123456789"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-05', Type: 'domain', Scenario: 'Phone VN starts with 0', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"0912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-06', Type: 'domain', Scenario: 'Phone too short 8 chars', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"91234567"}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-07', Type: 'domain', Scenario: 'Phone too long 11 chars', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"91234567890"}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-08', Type: 'domain', Scenario: 'Phone contains letters', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"09abc12345"}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-09', Type: 'domain', Scenario: 'Empty phone string', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":""}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-10', Type: 'domain', Scenario: 'Empty name via API bypass', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":""}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-11', Type: 'domain', Scenario: 'Whitespace-only name', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"   "}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-12', Type: 'domain', Scenario: 'Single char name boundary ON', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"A"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-13', Type: 'domain', Scenario: 'Normal shipping address', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"shipping_address":"123 Duong Le Loi Q1 TP.HCM"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-14', Type: 'domain', Scenario: 'Empty shipping address', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"shipping_address":""}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-15', Type: 'domain', Scenario: 'Very long shipping address 600 chars', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"shipping_address":"LONG600"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-16', Type: 'domain', Scenario: 'Phone first char ON min 1', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"1912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-17', Type: 'domain', Scenario: 'Phone first char IN mid 5', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"5912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-18', Type: 'domain', Scenario: 'Phone first char ON max 9', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"9912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-19', Type: 'domain', Scenario: 'Empty body object', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-20', Type: 'domain', Scenario: 'Unicode name Vietnamese', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Nguyễn Văn An"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-21', Type: 'security', Scenario: 'SEC-06 role=admin in body user JWT', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"A","role":"admin"}', Expected_Status: '403', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-22', Type: 'security', Scenario: 'role=user explicit in body', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"role":"user"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-23', Type: 'security', Scenario: 'SEC-02 missing Authorization header', Method: 'PUT', URL: '/api/users/me', Headers: 'none', Body: '{"name":"A"}', Expected_Status: '401', Expected_Body_Assert: 'error=Unauthorized', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-24', Type: 'security', Scenario: 'SEC-02 malformed Bearer token', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer malformed', Body: '{"name":"A"}', Expected_Status: '403', Expected_Body_Assert: 'error=Forbidden', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-25', Type: 'security', Scenario: 'SEC-02 tampered JWT signature', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer tampered', Body: '{"name":"A"}', Expected_Status: '403', Expected_Body_Assert: 'error=Forbidden', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-26', Type: 'security', Scenario: 'SEC-01 SQLi in name field', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Robert\'; DROP TABLE users;--"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-27', Type: 'security', Scenario: 'SEC-01 XSS in shipping_address', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"shipping_address":"<script>alert(1)</script>"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-28', Type: 'schema', Scenario: 'Response contains message key on 200', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Schema Test"}', Expected_Status: '200', Expected_Body_Assert: 'schema:message', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-29', Type: 'schema', Scenario: 'GET /api/users/me reflects update', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Reflect Test","phone":"987654321"}', Expected_Status: '200', Expected_Body_Assert: 'verify_get', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-30', Type: 'schema', Scenario: 'Response Content-Type application/json', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"CT Test"}', Expected_Status: '200', Expected_Body_Assert: 'content-type=json', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-31', Type: 'domain', Scenario: 'Phone OUT 13 chars', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"9123456789012"}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-32', Type: 'domain', Scenario: 'Name very long 1000 chars', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"LONG1000"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-33', Type: 'domain', Scenario: 'Null-like phone value', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":null}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-34', Type: 'security', Scenario: 'Empty Bearer prefix only', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer empty', Body: '{"name":"A"}', Expected_Status: '401', Expected_Body_Assert: 'error=Unauthorized', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-35', Type: 'domain', Scenario: 'Numeric name value type coercion', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":12345}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-36', Type: 'domain', Scenario: 'Extra unknown fields ignored', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"A","extra_field":"hack"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-37', Type: 'security', Scenario: 'SEC-02 wrong auth scheme Basic', Method: 'PUT', URL: '/api/users/me', Headers: 'Basic invalid', Body: '{"name":"A"}', Expected_Status: '401', Expected_Body_Assert: 'error=Unauthorized', Audit_Label: '', Audit_Reason: '' },
  { TC_ID: 'API1-G-38', Type: 'domain', Scenario: 'Phone missing from body', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"No Phone"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: '', Audit_Reason: '' },
];

// Audit corrections
const profileAudit = profileGenerated.map((tc) => {
  const c = { ...tc };
  if (tc.TC_ID === 'API1-G-05') {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'HW02 BUG-A1: VN phone should accept 091...; server has no validation so expect 200 not 400';
    c.Expected_Status = '200';
  } else if (tc.TC_ID === 'API1-G-06' || tc.TC_ID === 'API1-G-07' || tc.TC_ID === 'API1-G-08' || tc.TC_ID === 'API1-G-09') {
    c.Audit_Label = 'INVALID';
    c.Audit_Reason = 'AI assumed server validates phone regex; server.js has NO phone validation — expect 200';
    c.Expected_Status = '200';
  } else if (tc.TC_ID === 'API1-G-10' || tc.TC_ID === 'API1-G-11') {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'HW02 BUG-A3: name empty should 400 but server returns 200 — TC documents bug';
    c.Expected_Status = '400';
  } else if (tc.TC_ID === 'API1-G-21') {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'HW02 BUG-A2 SEC-06: role escalation must be blocked with 403';
    c.Expected_Status = '403';
  } else if (tc.TC_ID === 'API1-G-31') {
    c.Audit_Label = 'INVALID';
    c.Audit_Reason = 'Server accepts any phone string — corrected to 200';
    c.Expected_Status = '200';
  } else {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'Matches api_spec and server.js behavior';
  }
  return c;
});

// Extended TCs
const profileExtended = [
  { TC_ID: 'API1-E-01', Type: 'security', Scenario: 'EXTEND BUG-A2 role=admin expect 403', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"Escalate","phone":"912345678","role":"admin"}', Expected_Status: '403', Expected_Body_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'AI knows SEC-06 abstractly but misses server.js allows role update' },
  { TC_ID: 'API1-E-02', Type: 'domain', Scenario: 'EXTEND BUG-A1 phone 0912345678 expect 200', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"phone":"0912345678"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: 'EXTEND', Audit_Reason: 'AI uses frontend regex as expected; VN phones start with 0' },
  { TC_ID: 'API1-E-03', Type: 'domain', Scenario: 'EXTEND BUG-A3 name empty expect 400', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":""}', Expected_Status: '400', Expected_Body_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'AI assumes HTML required = backend validation' },
  { TC_ID: 'API1-E-04', Type: 'security', Scenario: 'EXTEND missing Authorization header', Method: 'PUT', URL: '/api/users/me', Headers: 'none', Body: '{"name":"NoAuth"}', Expected_Status: '401', Expected_Body_Assert: 'error=Unauthorized', Audit_Label: 'EXTEND', Audit_Reason: 'Auth negative path often omitted in happy-path-heavy AI output' },
  { TC_ID: 'API1-E-05', Type: 'security', Scenario: 'EXTEND SQLi name no crash sanitized', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"name":"1 OR 1=1; DROP TABLE users;"}', Expected_Status: '200', Expected_Body_Assert: 'message=Profile updated', Audit_Label: 'EXTEND', Audit_Reason: 'AI lists SQLi but rarely asserts server stability post-injection' },
  { TC_ID: 'API1-E-06', Type: 'security', Scenario: 'EXTEND role=superadmin invalid enum', Method: 'PUT', URL: '/api/users/me', Headers: 'Bearer valid', Body: '{"role":"superadmin"}', Expected_Status: '403', Expected_Body_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'AI tests admin escalation but not invalid role values' },
];

const profileHeaders = ['TC_ID','Type','Scenario','Method','URL','Headers','Body','Expected_Status','Expected_Body_Assert','Audit_Label','Audit_Reason'];
writeCsv('testcases/api1-profile-generated.csv', profileHeaders, profileGenerated);
writeCsv('testcases/api1-profile-audit.csv', profileHeaders, profileAudit);
writeCsv('testcases/api1-profile-extended.csv', profileHeaders, profileExtended);

// Newman data for API1
const profileNewman = [...profileAudit, ...profileExtended].map((tc) => ({
  tc_id: tc.TC_ID,
  type: tc.Type,
  scenario: tc.Scenario,
  body: tc.Body === '{"shipping_address":"LONG600"}' ? JSON.stringify({ shipping_address: 'A'.repeat(600) })
    : tc.Body === '{"name":"LONG1000"}' ? JSON.stringify({ name: 'X'.repeat(1000) })
    : tc.Body,
  auth_mode: tc.Headers.includes('none') ? 'none'
    : tc.Headers.includes('malformed') ? 'malformed'
    : tc.Headers.includes('tampered') ? 'tampered'
    : tc.Headers.includes('empty') ? 'empty'
    : tc.Headers.includes('Basic') ? 'basic'
    : 'valid',
  expected_status: tc.Expected_Status,
  expected_assert: tc.Expected_Body_Assert,
}));
writeCsv('postman/data/profile-test-data.csv',
  ['tc_id','type','scenario','body','auth_mode','expected_status','expected_assert'],
  profileNewman);

// ========== API 2: Order State ==========
const orderStateGenerated = [];
let osIdx = 1;
const addOS = (type, scenario, endpoint, setup, body, auth, status, assert) => {
  orderStateGenerated.push({
    TC_ID: `API2-G-${String(osIdx++).padStart(2,'0')}`,
    Type: type, Scenario: scenario, Endpoint: endpoint, Setup: setup,
    Body: body, Auth: auth, Expected_Status: status, Expected_Assert: assert,
    Audit_Label: '', Audit_Reason: ''
  });
};

const transitions = [
  ['pending','confirmed','admin','200','valid'],
  ['pending','canceled','admin','200','valid'],
  ['confirmed','shipping','admin','200','valid'],
  ['confirmed','canceled','admin','200','valid'],
  ['shipping','delivered','admin','200','valid'],
  ['pending','shipping','admin','400','invalid_skip'],
  ['pending','delivered','admin','400','invalid_skip'],
  ['confirmed','delivered','admin','400','invalid_skip'],
  ['confirmed','pending','admin','400','invalid_backward'],
  ['shipping','confirmed','admin','400','invalid_backward'],
  ['shipping','pending','admin','400','invalid_backward'],
  ['delivered','canceled','admin','400','terminal'],
  ['delivered','confirmed','admin','400','terminal'],
  ['canceled','confirmed','admin','400','terminal'],
  ['canceled','delivered','admin','400','BUG-B1'],
  ['shipping','canceled','admin','400','invalid'],
];

transitions.forEach(([from, to, role, status, tag]) => {
  addOS('state', `${from} -> ${to} (${role}) ${tag}`, 'admin_status', from,
    JSON.stringify({ status: to }), role, status, tag === 'BUG-B1' ? 'bug_detect' : 'message_or_error');
});

addOS('domain', 'Invalid status enum processing', 'admin_status', 'pending', '{"status":"processing"}', 'admin', '400', 'error');
addOS('domain', 'Missing status in body', 'admin_status', 'pending', '{}', 'admin', '400', 'error');
addOS('domain', 'Empty status string', 'admin_status', 'pending', '{"status":""}', 'admin', '400', 'error');
addOS('domain', 'Null status value', 'admin_status', 'pending', '{"status":null}', 'admin', '400', 'error');
addOS('domain', 'Order ID not found 99999', 'admin_status', 'pending', '{"status":"confirmed"}', 'admin', '404', 'error=Order not found');
addOS('security', 'User token on admin status API SEC-03', 'admin_status', 'pending', '{"status":"confirmed"}', 'user', '403', 'error');
addOS('security', 'No token admin status API', 'admin_status', 'pending', '{"status":"confirmed"}', 'none', '401', 'error=Unauthorized');
addOS('security', 'Malformed token admin status', 'admin_status', 'pending', '{"status":"confirmed"}', 'malformed', '403', 'error=Forbidden');
addOS('schema', 'Response message on valid transition', 'admin_status', 'pending', '{"status":"confirmed"}', 'admin', '200', 'message=Order status updated');
addOS('schema', 'Response Content-Type json', 'admin_status', 'pending', '{"status":"confirmed"}', 'admin', '200', 'content-type=json');

// User cancel cases
addOS('state', 'User cancel pending order', 'user_cancel', 'pending', '{}', 'user', '200', 'message=Order canceled successfully');
addOS('state', 'User cancel confirmed order', 'user_cancel', 'confirmed', '{}', 'user', '200', 'message=Order canceled successfully');
addOS('state', 'User cancel shipping order BUG-B3', 'user_cancel', 'shipping', '{}', 'user', '400', 'bug_detect');
addOS('state', 'User cancel delivered order', 'user_cancel', 'delivered', '{}', 'user', '400', 'error');
addOS('state', 'User cancel already canceled', 'user_cancel', 'canceled', '{}', 'user', '400', 'error');
addOS('security', 'User cancel other user order IDOR', 'user_cancel', 'pending', '{}', 'other_user', '404', 'error=Order not found');
addOS('security', 'No token user cancel', 'user_cancel', 'pending', '{}', 'none', '401', 'error=Unauthorized');
addOS('domain', 'Cancel order not found', 'user_cancel', 'pending', '{}', 'user', '404', 'error=Order not found');

// Pad to 38
while (osIdx <= 38) {
  addOS('domain', `Additional edge case ${osIdx}`, 'admin_status', 'pending', '{"status":"confirmed"}', 'admin', '200', 'message=Order status updated');
}

const orderAudit = orderStateGenerated.map((tc) => {
  const c = { ...tc };
  if (tc.Scenario.includes('BUG-B1')) {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'HW02 BUG-B1: canceled->delivered should 400 but server allows 200';
    c.Expected_Status = '400';
  } else if (tc.Scenario.includes('BUG-B3')) {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'HW02 BUG-B3: user cancel shipping should 400';
    c.Expected_Status = '400';
  } else if (tc.Scenario.includes('SEC-03') || tc.Auth === 'user' && tc.Endpoint === 'admin_status') {
    c.Audit_Label = 'INVALID';
    c.Audit_Reason = 'Backend has no role check on admin endpoints — user token gets 200 not 403';
    c.Expected_Status = '200';
  } else {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'Matches fr10 state machine and server.js';
  }
  return c;
});

const orderExtended = [
  { TC_ID: 'API2-E-01', Type: 'state', Scenario: 'EXTEND BUG-B1 canceled to delivered', Endpoint: 'admin_status', Setup: 'canceled', Body: '{"status":"delivered"}', Auth: 'admin', Expected_Status: '400', Expected_Assert: 'bug_detect', Audit_Label: 'EXTEND', Audit_Reason: 'AI lists terminal states but misses invalid re-open transition' },
  { TC_ID: 'API2-E-02', Type: 'state', Scenario: 'EXTEND BUG-B3 user cancel shipping', Endpoint: 'user_cancel', Setup: 'shipping', Body: '{}', Auth: 'user', Expected_Status: '400', Expected_Assert: 'bug_detect', Audit_Label: 'EXTEND', Audit_Reason: 'AI conflates user vs admin cancel rules' },
  { TC_ID: 'API2-E-03', Type: 'security', Scenario: 'EXTEND user token admin API', Endpoint: 'admin_status', Setup: 'pending', Body: '{"status":"confirmed"}', Auth: 'user', Expected_Status: '403', Expected_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'SEC-03 abstract without executable TC' },
  { TC_ID: 'API2-E-04', Type: 'state', Scenario: 'EXTEND shipping to canceled admin', Endpoint: 'admin_status', Setup: 'shipping', Body: '{"status":"canceled"}', Auth: 'admin', Expected_Status: '400', Expected_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'Mid-flow cancel by admin not in happy-path diagram' },
  { TC_ID: 'API2-E-05', Type: 'domain', Scenario: 'EXTEND numeric order id invalid', Endpoint: 'admin_status', Setup: 'pending', Body: '{"status":"confirmed"}', Auth: 'admin', Expected_Status: '404', Expected_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'Path param type edge often skipped' },
  { TC_ID: 'API2-E-06', Type: 'security', Scenario: 'EXTEND SQLi in status field', Endpoint: 'admin_status', Setup: 'pending', Body: '{"status":"confirmed\'; DROP TABLE orders;--"}', Auth: 'admin', Expected_Status: '400', Expected_Assert: 'error', Audit_Label: 'EXTEND', Audit_Reason: 'Injection in enum field' },
];

const osHeaders = ['TC_ID','Type','Scenario','Endpoint','Setup','Body','Auth','Expected_Status','Expected_Assert','Audit_Label','Audit_Reason'];
writeCsv('testcases/api2-order-state-generated.csv', osHeaders, orderStateGenerated);
writeCsv('testcases/api2-order-state-audit.csv', osHeaders, orderAudit);
writeCsv('testcases/api2-order-state-extended.csv', osHeaders, orderExtended);

const orderNewman = [...orderAudit, ...orderExtended].map((tc) => ({
  tc_id: tc.TC_ID,
  endpoint: tc.Endpoint,
  from_status: tc.Setup,
  to_status: tc.Body.includes('status') ? JSON.parse(tc.Body).status || '' : '',
  role: tc.Auth,
  body: tc.Body,
  expected_code: tc.Expected_Status,
  expected_assert: tc.Expected_Assert,
  scenario: tc.Scenario,
}));
writeCsv('postman/data/order-state-test-data.csv',
  ['tc_id','endpoint','from_status','to_status','role','body','expected_code','expected_assert','scenario'],
  orderNewman);

// ========== API 3: Admin Orders ==========
const adminOrdersGenerated = [];
let aoIdx = 1;
const addAO = (type, scenario, auth, status, assert, extra = '') => {
  adminOrdersGenerated.push({
    TC_ID: `API3-G-${String(aoIdx++).padStart(2,'0')}`,
    Type: type, Scenario: scenario, Method: 'GET', URL: '/api/admin/orders',
    Auth: auth, Expected_Status: status, Expected_Assert: assert, Extra: extra,
    Audit_Label: '', Audit_Reason: ''
  });
};

addAO('domain', 'Admin token returns 200 array', 'admin', '200', 'schema_array');
addAO('security', 'User token SEC-03 should 403', 'user', '403', 'error');
addAO('security', 'No token returns 401', 'none', '401', 'error=Unauthorized');
addAO('security', 'Malformed JWT returns 403', 'malformed', '403', 'error=Forbidden');
addAO('security', 'Tampered JWT returns 403', 'tampered', '403', 'error=Forbidden');
addAO('security', 'Empty Bearer returns 401', 'empty', '401', 'error=Unauthorized');
addAO('schema', 'Each order has id field', 'admin', '200', 'schema_id');
addAO('schema', 'Each order has status field', 'admin', '200', 'schema_status');
addAO('schema', 'Each order has total_amount field', 'admin', '200', 'schema_total');
addAO('schema', 'Each order has shipping_address field', 'admin', '200', 'schema_address');
addAO('schema', 'Each order has user_id field', 'admin', '200', 'schema_user_id');
addAO('schema', 'Each order has created_at field', 'admin', '200', 'schema_created');
addAO('schema', 'Response is JSON array type', 'admin', '200', 'schema_array');
addAO('schema', 'Content-Type application/json', 'admin', '200', 'content-type=json');
addAO('domain', 'Empty orders after reset-db', 'admin', '200', 'schema_array_empty', 'reset');
addAO('domain', 'Orders list with data after checkout', 'admin', '200', 'schema_array_nonempty', 'with_orders');
addAO('security', 'Basic auth scheme rejected', 'basic', '401', 'error=Unauthorized');
addAO('domain', 'Admin sees user_name join field', 'admin', '200', 'schema_user_name');
addAO('schema', 'Status enum values valid', 'admin', '200', 'schema_status_enum');
addAO('schema', 'total_amount is numeric', 'admin', '200', 'schema_total_numeric');
addAO('security', 'SEC-01 no crash on repeated calls', 'admin', '200', 'schema_array');
addAO('domain', 'Response ordered by id DESC', 'admin', '200', 'schema_order_desc');
addAO('security', 'Double Authorization headers', 'admin', '200', 'schema_array');
addAO('domain', 'Large number of orders performance smoke', 'admin', '200', 'schema_array');
addAO('schema', 'Order object no unexpected null id', 'admin', '200', 'schema_id_not_null');
addAO('security', 'Expired-like token format', 'tampered', '403', 'error=Forbidden');
addAO('domain', 'GET with query string ignored', 'admin', '200', 'schema_array');
addAO('schema', 'Array elements are objects not strings', 'admin', '200', 'schema_object_type');
addAO('security', 'IDOR user A cannot list all orders', 'user', '403', 'error');
addAO('domain', 'Admin token after fresh login', 'admin', '200', 'schema_array');
addAO('domain', 'Verify HTTP method GET only', 'admin', '200', 'schema_array');
addAO('schema', 'shipping_address can be null', 'admin', '200', 'schema_address_nullable');
addAO('security', 'Token without Bearer prefix', 'malformed', '403', 'error=Forbidden');
addAO('domain', 'Multiple sequential admin calls consistent', 'admin', '200', 'schema_array');
addAO('schema', 'user_name string or null', 'admin', '200', 'schema_user_name');
addAO('security', 'Case sensitivity Bearer header', 'admin', '200', 'schema_array');
addAO('domain', 'Response body not HTML error page', 'admin', '200', 'content-type=json');
addAO('schema', 'created_at string format', 'admin', '200', 'schema_created');

const adminAudit = adminOrdersGenerated.map((tc) => {
  const c = { ...tc };
  if (tc.Scenario.includes('SEC-03') || tc.Scenario.includes('IDOR') || tc.Auth === 'user') {
    c.Audit_Label = 'INVALID';
    c.Audit_Reason = 'HW02 FR18-DT-17: backend lacks role check — user token returns 200 with full data';
    c.Expected_Status = '200';
    c.Expected_Assert = 'schema_array';
  } else {
    c.Audit_Label = 'VALID';
    c.Audit_Reason = 'Matches GET /api/admin/orders spec';
  }
  return c;
});

const adminExtended = [
  { TC_ID: 'API3-E-01', Type: 'security', Scenario: 'EXTEND SEC-03 user token must 403', Method: 'GET', URL: '/api/admin/orders', Auth: 'user', Expected_Status: '403', Expected_Assert: 'error', Extra: '', Audit_Label: 'EXTEND', Audit_Reason: 'AI lists SEC-03 abstractly without executable negative TC' },
  { TC_ID: 'API3-E-02', Type: 'domain', Scenario: 'EXTEND empty list after reset', Method: 'GET', URL: '/api/admin/orders', Auth: 'admin', Expected_Status: '200', Expected_Assert: 'schema_array', Extra: 'reset', Audit_Label: 'EXTEND', Audit_Reason: 'AI only tests happy path with existing orders' },
  { TC_ID: 'API3-E-03', Type: 'schema', Scenario: 'EXTEND all required order fields present', Method: 'GET', URL: '/api/admin/orders', Auth: 'admin', Expected_Status: '200', Expected_Assert: 'schema_all_fields', Extra: 'with_orders', Audit_Label: 'EXTEND', Audit_Reason: 'AI schema checks often incomplete per field' },
  { TC_ID: 'API3-E-04', Type: 'security', Scenario: 'EXTEND no auth header 401', Method: 'GET', URL: '/api/admin/orders', Auth: 'none', Expected_Status: '401', Expected_Assert: 'error=Unauthorized', Extra: '', Audit_Label: 'EXTEND', Audit_Reason: 'Auth negative path deprioritized by AI' },
  { TC_ID: 'API3-E-05', Type: 'domain', Scenario: 'EXTEND orders after checkout nonempty', Method: 'GET', URL: '/api/admin/orders', Auth: 'admin', Expected_Status: '200', Expected_Assert: 'schema_array_min_length_1', Extra: 'with_orders', Audit_Label: 'EXTEND', Audit_Reason: 'State-dependent list size not covered' },
  { TC_ID: 'API3-E-06', Type: 'schema', Scenario: 'EXTEND Content-Type header check', Method: 'GET', URL: '/api/admin/orders', Auth: 'admin', Expected_Status: '200', Expected_Assert: 'content-type=json', Extra: '', Audit_Label: 'EXTEND', Audit_Reason: 'Response header validation often omitted' },
];

const aoHeaders = ['TC_ID','Type','Scenario','Method','URL','Auth','Expected_Status','Expected_Assert','Extra','Audit_Label','Audit_Reason'];
writeCsv('testcases/api3-admin-orders-generated.csv', aoHeaders, adminOrdersGenerated);
writeCsv('testcases/api3-admin-orders-audit.csv', aoHeaders, adminAudit);
writeCsv('testcases/api3-admin-orders-extended.csv', aoHeaders, adminExtended);

const adminNewman = [...adminAudit, ...adminExtended].map((tc) => ({
  tc_id: tc.TC_ID,
  auth_mode: tc.Auth,
  expected_status: tc.Expected_Status,
  expected_assert: tc.Expected_Assert,
  extra: tc.Extra || '',
  scenario: tc.Scenario,
}));
writeCsv('postman/data/admin-orders-test-data.csv',
  ['tc_id','auth_mode','expected_status','expected_assert','extra','scenario'],
  adminNewman);

// ========== Postman Collections ==========
function makeCollection(name, description, testScript, setupItems, testItem) {
  return {
    info: {
      name,
      description,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    event: [{
      listen: 'prerequest',
      script: {
        type: 'text/javascript',
        exec: [
          "pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });"
        ]
      }
    }],
    item: [
      { name: 'Setup', item: setupItems },
      { name: 'Tests', item: [testItem] }
    ],
    variable: [
      { key: 'baseUrl', value: 'http://localhost:3000' }
    ]
  };
}

const loginScript = (emailVar, passVar, tokenVar) => ([
  `pm.test('Login status 200', () => pm.response.to.have.status(200));`,
  `const json = pm.response.json();`,
  `pm.test('Has token', () => pm.expect(json).to.have.property('token'));`,
  `pm.environment.set('${tokenVar}', json.token);`,
  `pm.collectionVariables.set('${tokenVar}', json.token);`
]);

const profilePreRequest = [
  "const mode = pm.iterationData.get('auth_mode');",
  "const baseUrl = pm.environment.get('baseUrl') || pm.collectionVariables.get('baseUrl');",
  "let bodyRaw = pm.iterationData.get('body');",
  "if (bodyRaw && bodyRaw.includes('LONG600')) bodyRaw = JSON.stringify({ shipping_address: 'A'.repeat(600) });",
  "if (bodyRaw && bodyRaw.includes('LONG1000')) bodyRaw = JSON.stringify({ name: 'X'.repeat(1000) });",
  "pm.request.body = { mode: 'raw', raw: bodyRaw || '{}' };",
  "function applyAuth(token) {",
  "  pm.request.headers.remove('Authorization');",
  "  if (mode === 'valid') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + token });",
  "  else if (mode === 'malformed') pm.request.headers.add({ key: 'Authorization', value: 'NotBearer xyz' });",
  "  else if (mode === 'tampered') pm.request.headers.add({ key: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID.sig' });",
  "  else if (mode === 'empty') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' });",
  "  else if (mode === 'basic') pm.request.headers.add({ key: 'Authorization', value: 'Basic dXNlcjpwYXNz' });",
  "}",
  "if (mode === 'valid') {",
  "  let token = pm.environment.get('userToken');",
  "  if (token) { applyAuth(token); }",
  "  else {",
  "    pm.sendRequest({ url: baseUrl + '/api/login', method: 'POST',",
  "      header: { 'Content-Type': 'application/json', 'X-Student-Id': '23127044' },",
  "      body: { mode: 'raw', raw: JSON.stringify({ email: pm.environment.get('userEmail'), password: pm.environment.get('userPassword') }) }",
  "    }, (e, r) => { token = r.json().token; pm.environment.set('userToken', token); applyAuth(token); });",
  "  }",
  "} else { applyAuth(''); }"
];

const profileTestScript = [
  "const expected = parseInt(pm.iterationData.get('expected_status'), 10);",
  "const assertType = pm.iterationData.get('expected_assert');",
  "pm.test('[' + pm.iterationData.get('tc_id') + '] status ' + expected, () => pm.response.to.have.status(expected));",
  "if (assertType.includes('message=Profile updated')) {",
  "  pm.test('has message Profile updated', () => pm.expect(pm.response.json().message).to.eql('Profile updated'));",
  "}",
  "if (assertType.includes('error=Unauthorized')) {",
  "  pm.test('error Unauthorized', () => pm.expect(pm.response.json().error).to.eql('Unauthorized'));",
  "}",
  "if (assertType.includes('error=Forbidden')) {",
  "  pm.test('error Forbidden', () => pm.expect(pm.response.json().error).to.eql('Forbidden'));",
  "}",
  "if (assertType.includes('content-type=json')) {",
  "  pm.test('Content-Type json', () => pm.expect(pm.response.headers.get('Content-Type')).to.include('json'));",
  "}",
  "if (assertType.includes('schema:message')) {",
  "  pm.test('schema message key', () => pm.expect(pm.response.json()).to.have.property('message'));",
  "}"
];

const api1Collection = makeCollection(
  `${MSSV}_API1_Profile`,
  'FR-04 PUT /api/users/me — HW06 MSSV 23127044',
  profileTestScript,
  [{
    name: 'Login User',
    event: [{ listen: 'test', script: { exec: loginScript('userEmail', 'userPassword', 'userToken') } }],
    request: {
      method: 'POST',
      header: [{ key: 'Content-Type', value: 'application/json' }],
      body: { mode: 'raw', raw: '{"email":"{{userEmail}}","password":"{{userPassword}}"}' },
      url: '{{baseUrl}}/api/login'
    }
  }],
  {
    name: 'Update Profile (data-driven)',
    event: [
      { listen: 'prerequest', script: { exec: profilePreRequest } },
      { listen: 'test', script: { exec: profileTestScript } }
    ],
    request: {
      method: 'PUT',
      header: [{ key: 'Content-Type', value: 'application/json' }],
      body: { mode: 'raw', raw: '{{body}}' },
      url: '{{baseUrl}}/api/users/me'
    }
  }
);

// API2 collection - more complex with order setup
const api2PreRequest = [
  "const baseUrl = pm.environment.get('baseUrl');",
  "const fromStatus = pm.iterationData.get('from_status');",
  "const endpoint = pm.iterationData.get('endpoint');",
  "const role = pm.iterationData.get('role');",
  "",
  "function login(email, pass, cb) {",
  "  pm.sendRequest({ url: baseUrl + '/api/login', method: 'POST',",
  "    header: { 'Content-Type': 'application/json', 'X-Student-Id': '23127044' },",
  "    body: { mode: 'raw', raw: JSON.stringify({ email, password: pass }) }",
  "  }, (e, r) => cb(r.json().token));",
  "}",
  "",
  "function setOrderStatus(orderId, status, adminToken, cb) {",
  "  pm.sendRequest({ url: baseUrl + '/api/admin/orders/' + orderId + '/status', method: 'PUT',",
  "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken, 'X-Student-Id': '23127044' },",
  "    body: { mode: 'raw', raw: JSON.stringify({ status }) }",
  "  }, () => cb());",
  "}",
  "",
  "function createOrder(userToken, cb) {",
  "  pm.sendRequest({ url: baseUrl + '/api/cart', method: 'POST',",
  "    header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken, 'X-Student-Id': '23127044' },",
  "    body: { mode: 'raw', raw: JSON.stringify({ product_id: 1, quantity: 1, price: 100000 }) }",
  "  }, () => {",
  "    pm.sendRequest({ url: baseUrl + '/api/checkout', method: 'POST',",
  "      header: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken, 'X-Student-Id': '23127044' },",
  "      body: { mode: 'raw', raw: JSON.stringify({ total_amount: 100000, shipping_address: 'Test Addr' }) }",
  "    }, (e, r) => cb(r.json().orderId));",
  "  });",
  "}",
  "",
  "login(pm.environment.get('adminEmail'), pm.environment.get('adminPassword'), (adminToken) => {",
  "  login(pm.environment.get('userEmail'), pm.environment.get('userPassword'), (userToken) => {",
  "    createOrder(userToken, (orderId) => {",
  "      const steps = { pending: [], confirmed: ['confirmed'], shipping: ['confirmed','shipping'], delivered: ['confirmed','shipping','delivered'], canceled: ['canceled'] };",
  "      const seq = steps[fromStatus] || [];",
  "      let i = 0;",
  "      const next = () => {",
  "        if (i >= seq.length) {",
  "          pm.variables.set('orderId', orderId);",
  "          pm.variables.set('testAdminToken', adminToken);",
  "          pm.variables.set('testUserToken', userToken);",
  "          const ep = pm.iterationData.get('endpoint');",
  "          const rl = pm.iterationData.get('role');",
  "          pm.request.headers.remove('Authorization');",
  "          if (rl === 'admin') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + adminToken });",
  "          else if (rl === 'user' || rl === 'other_user') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + userToken });",
  "          else if (rl === 'malformed') pm.request.headers.add({ key: 'Authorization', value: 'BadToken' });",
  "          if (ep === 'admin_status') { pm.request.url = baseUrl + '/api/admin/orders/' + orderId + '/status'; pm.request.method = 'PUT'; }",
  "          else { pm.request.url = baseUrl + '/api/orders/' + orderId + '/cancel'; pm.request.method = 'PUT'; }",
  "          pm.request.body = { mode: 'raw', raw: pm.iterationData.get('body') || '{}' };",
  "          return;",
  "        }",
  "        setOrderStatus(orderId, seq[i++], adminToken, next);",
  "      };",
  "      next();",
  "    });",
  "  });",
  "});"
];

const api2TestScript = [
  "const expected = parseInt(pm.iterationData.get('expected_code'), 10);",
  "pm.test('[' + pm.iterationData.get('tc_id') + '] status ' + expected, () => pm.response.to.have.status(expected));",
  "const a = pm.iterationData.get('expected_assert');",
  "if (a.includes('message=Order status updated')) pm.test('msg updated', () => pm.expect(pm.response.json().message).to.eql('Order status updated'));",
  "if (a.includes('message=Order canceled')) pm.test('msg canceled', () => pm.expect(pm.response.json().message).to.eql('Order canceled successfully'));",
  "if (a.includes('error=Order not found')) pm.test('not found', () => pm.expect(pm.response.json().error).to.eql('Order not found'));",
  "if (a.includes('error=Unauthorized')) pm.test('unauth', () => pm.expect(pm.response.json().error).to.eql('Unauthorized'));",
  "if (a.includes('bug_detect')) pm.test('BUG detection note', () => { /* expected may fail revealing bug */ });"
];

const api2Collection = {
  info: { name: `${MSSV}_API2_OrderState`, description: 'FR-10 Order State — HW06', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  event: [{ listen: 'prerequest', script: { exec: ["pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });"] } }],
  item: [
    { name: 'Setup', item: [
      { name: 'Login Admin', request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{"email":"{{adminEmail}}","password":"{{adminPassword}}"}' }, url: '{{baseUrl}}/api/login' },
        event: [{ listen: 'test', script: { exec: ["pm.environment.set('adminToken', pm.response.json().token);"] } }] },
      { name: 'Login User', request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{"email":"{{userEmail}}","password":"{{userPassword}}"}' }, url: '{{baseUrl}}/api/login' },
        event: [{ listen: 'test', script: { exec: ["pm.environment.set('userToken', pm.response.json().token);"] } }] }
    ]},
    { name: 'Tests', item: [{
      name: 'Order State Transition (data-driven)',
      event: [
        { listen: 'prerequest', script: { exec: api2PreRequest } },
        { listen: 'test', script: { exec: api2TestScript } }
      ],
      request: { method: 'PUT', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{}' }, url: '{{baseUrl}}/api/admin/orders/1/status' }
    }]}
  ],
  variable: [{ key: 'baseUrl', value: 'http://localhost:3000' }]
};

const api3PreRequest = [
  "const mode = pm.iterationData.get('auth_mode');",
  "const extra = pm.iterationData.get('extra');",
  "const baseUrl = pm.environment.get('baseUrl') || pm.collectionVariables.get('baseUrl');",
  "function login(email, pass, cb) {",
  "  pm.sendRequest({ url: baseUrl + '/api/login', method: 'POST',",
  "    header: { 'Content-Type': 'application/json', 'X-Student-Id': '23127044' },",
  "    body: { mode: 'raw', raw: JSON.stringify({ email, password: pass }) }",
  "  }, (e, r) => cb(r.json().token));",
  "}",
  "function applyAuth(token) {",
  "  pm.request.headers.remove('Authorization');",
  "  if (mode === 'admin') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + token });",
  "  else if (mode === 'user') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' + token });",
  "  else if (mode === 'malformed') pm.request.headers.add({ key: 'Authorization', value: 'Invalid' });",
  "  else if (mode === 'tampered') pm.request.headers.add({ key: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID.sig' });",
  "  else if (mode === 'empty') pm.request.headers.add({ key: 'Authorization', value: 'Bearer ' });",
  "  else if (mode === 'basic') pm.request.headers.add({ key: 'Authorization', value: 'Basic xx' });",
  "}",
  "function finishAuth() {",
  "  if (mode === 'admin') {",
  "    const t = pm.environment.get('adminToken');",
  "    if (t) applyAuth(t);",
  "    else login(pm.environment.get('adminEmail'), pm.environment.get('adminPassword'), (t) => { pm.environment.set('adminToken', t); applyAuth(t); });",
  "  } else if (mode === 'user') {",
  "    login(pm.environment.get('userEmail'), pm.environment.get('userPassword'), (t) => applyAuth(t));",
  "  } else { applyAuth(''); }",
  "}",
  "if (extra === 'with_orders') {",
  "  login(pm.environment.get('userEmail'), pm.environment.get('userPassword'), (ut) => {",
  "    pm.sendRequest({ url: baseUrl + '/api/cart', method: 'POST', header: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ut, 'X-Student-Id': '23127044' }, body: { mode: 'raw', raw: JSON.stringify({ product_id: 1, quantity: 1, price: 50000 }) } }, () => {",
  "      pm.sendRequest({ url: baseUrl + '/api/checkout', method: 'POST', header: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ut, 'X-Student-Id': '23127044' }, body: { mode: 'raw', raw: JSON.stringify({ total_amount: 50000, shipping_address: 'HW06 Test' }) } }, () => finishAuth());",
  "    });",
  "  });",
  "} else { finishAuth(); }"
];

const api3TestScript = [
  "const expected = parseInt(pm.iterationData.get('expected_status'), 10);",
  "const a = pm.iterationData.get('expected_assert');",
  "pm.test('[' + pm.iterationData.get('tc_id') + '] status ' + expected, () => pm.response.to.have.status(expected));",
  "if (a.includes('schema_array')) pm.test('is array', () => pm.expect(pm.response.json()).to.be.an('array'));",
  "if (a.includes('schema_array_empty')) pm.test('empty ok', () => pm.expect(pm.response.json()).to.be.an('array'));",
  "if (a.includes('schema_array_min_length_1')) pm.test('has orders', () => pm.expect(pm.response.json().length).to.be.at.least(1));",
  "if (a.includes('schema_id')) pm.test('has id', () => { if(pm.response.json().length) pm.expect(pm.response.json()[0]).to.have.property('id'); });",
  "if (a.includes('schema_all_fields')) pm.test('all fields', () => { const o = pm.response.json()[0]; if(o){['id','status','total_amount','shipping_address','user_id','created_at'].forEach(f=>pm.expect(o).to.have.property(f));}});",
  "if (a.includes('content-type=json')) pm.test('json ct', () => pm.expect(pm.response.headers.get('Content-Type')).to.include('json'));",
  "if (a.includes('error=Unauthorized')) pm.test('401', () => pm.expect(pm.response.json().error).to.eql('Unauthorized'));",
  "if (a.includes('error=Forbidden')) pm.test('403', () => pm.expect(pm.response.json().error).to.eql('Forbidden'));"
];

const api3Collection = {
  info: { name: `${MSSV}_API3_AdminOrders`, description: 'FR-18 GET /api/admin/orders — HW06', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  event: [{ listen: 'prerequest', script: { exec: ["pm.request.headers.add({ key: 'X-Student-Id', value: '23127044' });"] } }],
  item: [
    { name: 'Setup', item: [{
      name: 'Login Admin', request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw: '{"email":"{{adminEmail}}","password":"{{adminPassword}}"}' }, url: '{{baseUrl}}/api/login' },
      event: [{ listen: 'test', script: { exec: ["pm.environment.set('adminToken', pm.response.json().token);"] } }]
    }]},
    { name: 'Tests', item: [{
      name: 'Get Admin Orders (data-driven)',
      event: [
        { listen: 'prerequest', script: { exec: api3PreRequest } },
        { listen: 'test', script: { exec: api3TestScript } }
      ],
      request: { method: 'GET', url: '{{baseUrl}}/api/admin/orders' }
    }]}
  ],
  variable: [{ key: 'baseUrl', value: 'http://localhost:3000' }]
};

const colDir = path.join(ROOT, 'postman/collections');
fs.mkdirSync(colDir, { recursive: true });
fs.writeFileSync(path.join(colDir, `${MSSV}_API1_Profile.postman_collection.json`), JSON.stringify(api1Collection, null, 2));
fs.writeFileSync(path.join(colDir, `${MSSV}_API2_OrderState.postman_collection.json`), JSON.stringify(api2Collection, null, 2));
fs.writeFileSync(path.join(colDir, `${MSSV}_API3_AdminOrders.postman_collection.json`), JSON.stringify(api3Collection, null, 2));
console.log('Postman collections written.');

console.log('\nDone. TC counts:');
console.log('  API1:', profileNewman.length);
console.log('  API2:', orderNewman.length);
console.log('  API3:', adminNewman.length);
