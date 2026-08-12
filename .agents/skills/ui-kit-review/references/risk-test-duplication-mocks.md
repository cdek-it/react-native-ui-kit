# Test Duplication And Mock Abuse

Read this card when scenarios repeat without purpose, mocks dominate a test, or
production APIs exist only for test access.

## Test Duplication

Look for one public scenario repeated at several levels without distinct risk,
identical input/assertion copies, stable component setup duplicated despite an
existing helper, and snapshot plus assertions redundantly proving the same
contract.

Do not flag explicit local arrange steps kept for readability or similar tests
that protect distinct components, states, or failure modes.

## Mock Abuse

Look for mocks recreating production behavior, assertions proving only
mock-to-mock calls, UI Kit component mocks removing the behavior under test,
production exports added solely for test access, and incomplete native or
animation mocks that create impossible states.

Identify the real boundary and smallest environment that exercises it. Mock
count or setup length alone does not determine severity.
