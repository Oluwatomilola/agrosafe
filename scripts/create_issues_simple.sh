#!/bin/bash

# Create issues one by one
gh issue create --title "Add Zero-Address Validation in Smart Contracts" --body "## Description
The contract doesn't validate zero-address in critical functions.

**Impact**: Potential loss of ownership or funds if zero address is passed.

**Solution**: 
- Add `require(owner != address(0), "Zero address not allowed")` in constructor
- Add similar validation in all functions that accept addresses"

echo "Created issue 1/20"

gh issue create --title "Implement Reentrancy Protection" --body "## Description
External calls in state-changing functions could be exploited.

**Impact**: Potential reentrancy attacks leading to fund loss or state corruption.

**Solution**: 
- Import and use OpenZeppelin's `ReentrancyGuard`
- Add `nonReentrant` modifier to state-changing functions"

echo "Created issue 2/20"

gh issue create --title "Implement Pagination for Data Retrieval" --body "## Description
Potential gas limit issues when iterating over farmers or produce.

**Impact**: Could make the contract unusable with large datasets.

**Solution**: 
- Implement pagination in view functions
- Add `limit` and `offset` parameters"

echo "Created issue 3/20"

gh issue create --title "Add Input Validation in Smart Contracts" --body "## Description
Inadequate validation of input parameters.

**Impact**: Invalid data could be stored on-chain.

**Solution**: 
- Add validation for string lengths
- Validate numerical ranges
- Add input sanitization"

echo "Created issue 4/20"

gh issue create --title "Implement Emergency Stop Pattern" --body "## Description
No way to pause the contract in emergencies.

**Impact**: No way to stop malicious or buggy behavior.

**Solution**: 
- Implement OpenZeppelin's `Pausable`
- Add pausable modifier to critical functions"

echo "Created issue 5/20"

echo "Please run the script again to create the next set of issues (6-20)"
