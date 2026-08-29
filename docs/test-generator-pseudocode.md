# Test Generator Pseudocode — HW06

**MSSV:** 23127044

```
FUNCTION generate_api_tests(api_endpoint, hw02_ref, api_spec):
    sessions = []
    
    // Step 1: Domain partitions
    variables = AI_PROMPT("List input variables from {api_spec} and {hw02_ref}")
    FOR each var IN variables:
        partitions = AI_PROMPT("Partition {var} into valid/invalid/edge")
        sessions.append(partitions)
    
    // Step 2: BVA (if applicable)
    IF var has numeric/regex boundary:
        bva_cases = AI_PROMPT("BVA ON/OFF/IN/OUT for {var}")
        sessions.append(bva_cases)
    
    // Step 3: Security SEC-01..07
    sec_cases = AI_PROMPT("Security TC for {api_endpoint} per SEC checklist")
    sessions.append(sec_cases)
    
    // Step 4: Schema validation
    schema_cases = AI_PROMPT("Assert response keys and types")
    sessions.append(schema_cases)
    
    // Step 5: Merge
    generated_csv = MERGE(sessions, min_rows=35)
    WRITE generated_csv TO testcases/{api}-generated.csv
    
    // Step 6: Human audit
    FOR each tc IN generated_csv:
        label = COMPARE(tc, hw02_ref, server_js)
        IF label == INVALID:
            tc.expected = FIX_FROM_CODE(tc)
        WRITE tc TO testcases/{api}-audit.csv
    
    // Step 7: Extend
    known_bugs = LOAD(hw02_ref.bug-report)
    extended = CREATE_TC_FROM_BUGS(known_bugs, min_count=5)
    WRITE extended TO testcases/{api}-extended.csv
    
    // Step 8: Postman + Newman
    merged = CONCAT(audit_csv, extended_csv)
    collection = BUILD_POSTMAN(api_endpoint, merged)
    newman_csv = MAP_TO_ITERATION_DATA(merged)
    RUN newman(collection, env, newman_csv)
    
    // Step 9: Bug report
    failures = FILTER(newman_results, expected != actual)
    FOR each fail IN failures:
        CREATE_GITHUB_ISSUE(fail)
    
    RETURN { generated_csv, audit_csv, extended_csv, newman_report }

FUNCTION BUILD_POSTMAN(endpoint, test_cases):
    collection.pre_request = "X-Student-Id: 23127044"
    collection.setup = [LOGIN_USER, LOGIN_ADMIN, CHECKOUT_IF_NEEDED]
    collection.tests = DATA_DRIVEN_REQUEST(endpoint, test_cases)
    collection.test_script = ASSERT_STATUS_AND_SCHEMA(test_cases)
    RETURN collection.json
```

## Input

- `api_specification.md`
- HW02 `domain-testing.md` / `bva.md` (reference only)
- `backend/server.js` (audit ground truth)

## Output

- CSV test cases (generated, audit, extended)
- Postman collection JSON
- Newman HTML report
- Bug report markdown + GitHub Issues
