#!/bin/bash

# Array of issues data
issues=(
  '{"title": "Add Zero-Address Validation in Smart Contracts", "body": "## Description\nThe contract doesn\'t validate zero-address in critical functions.\n\n**Impact**: Potential loss of ownership or funds if zero address is passed.\n\n**Solution**: \n- Add `require(owner != address(0), \"Zero address not allowed\")` in constructor\n- Add similar validation in all functions that accept addresses"}'
  
  '{"title": "Implement Reentrancy Protection", "body": "## Description\nExternal calls in state-changing functions could be exploited.\n\n**Impact**: Potential reentrancy attacks leading to fund loss or state corruption.\n\n**Solution**: \n- Import and use OpenZeppelin\'s `ReentrancyGuard`\n- Add `nonReentrant` modifier to state-changing functions"}'
  
  '{"title": "Implement Pagination for Data Retrieval", "body": "## Description\nPotential gas limit issues when iterating over farmers or produce.\n\n**Impact**: Could make the contract unusable with large datasets.\n\n**Solution**: \n- Implement pagination in view functions\n- Add `limit` and `offset` parameters"}'
  
  '{"title": "Add Input Validation in Smart Contracts", "body": "## Description\nInadequate validation of input parameters.\n\n**Impact**: Invalid data could be stored on-chain.\n\n**Solution**: \n- Add validation for string lengths\n- Validate numerical ranges\n- Add input sanitization"}'
  
  '{"title": "Implement Emergency Stop Pattern", "body": "## Description\nNo way to pause the contract in emergencies.\n\n**Impact**: No way to stop malicious or buggy behavior.\n\n**Solution**: \n- Implement OpenZeppelin\'s `Pausable`\n- Add pausable modifier to critical functions"}'
  
  '{"title": "Add Error Boundaries to React Components", "body": "## Description\nNo error boundaries in React components.\n\n**Impact**: Poor user experience on errors.\n\n**Solution**: \n- Implement React Error Boundaries\n- Add fallback UIs for error states"}'
  
  '{"title": "Add Loading States for Async Operations", "body": "## Description\nMissing loading indicators for async operations.\n\n**Impact**: Poor user experience during transactions.\n\n**Solution**: \n- Add loading states\n- Implement skeleton loaders\n- Add transaction status indicators"}'
  
  '{"title": "Make Contract Address Configurable", "body": "## Description\nContract address is hardcoded in the frontend.\n\n**Impact**: Hard to maintain and update.\n\n**Solution**: \n- Move contract addresses to environment variables\n- Support multiple networks"}'
  
  '{"title": "Implement Wallet Connection Persistence", "body": "## Description\nWallet connection state is not persisted.\n\n**Impact**: Users need to reconnect on page refresh.\n\n**Solution**: \n- Store connection state in localStorage\n- Implement auto-reconnect"}'
  
  '{"title": "Improve Mobile Responsiveness", "body": "## Description\nUI not fully responsive on mobile devices.\n\n**Impact**: Poor mobile user experience.\n\n**Solution**: \n- Implement responsive design patterns\n- Test on various screen sizes"}'
  
  '{"title": "Add Form Validation", "body": "## Description\nForms lack client-side validation.\n\n**Impact**: Poor UX and unnecessary blockchain transactions.\n\n**Solution**: \n- Add form validation using Formik/Yup\n- Show clear error messages"}'
  
  '{"title": "Secure Environment Variables", "body": "## Description\nSensitive data might be exposed in client-side code.\n\n**Impact**: Security risk if sensitive data is exposed.\n\n**Solution**: \n- Use Vite environment variables\n- Add input validation\n- Implement proper error handling"}'
  
  '{"title": "Implement Rate Limiting", "body": "## Description\nNo rate limiting on public functions.\n\n**Impact**: Potential for spam or denial of service.\n\n**Solution**: \n- Implement rate limiting\n- Add circuit breakers"}'
  
  '{"title": "Add Input Sanitization", "body": "## Description\nUser inputs are not sanitized.\n\n**Impact**: Potential XSS vulnerabilities.\n\n**Solution**: \n- Implement input sanitization\n- Use DOMPurify or similar"}'
  
  '{"title": "Implement Contract Upgradeability", "body": "## Description\nNo upgrade pattern implemented.\n\n**Impact**: Hard to fix bugs or upgrade functionality.\n\n**Solution**: \n- Use OpenZeppelin Upgrades\n- Implement proxy pattern"}'
  
  '{"title": "Improve Test Coverage", "body": "## Description\nMissing edge cases in tests.\n\n**Impact**: Undiscovered bugs.\n\n**Solution**: \n- Add more test cases\n- Test edge cases\n- Add fuzz testing"}'
  
  '{"title": "Improve Documentation", "body": "## Description\nIncomplete code documentation.\n\n**Impact**: Hard to maintain and onboard new developers.\n\n**Solution**: \n- Add NatSpec comments\n- Create user guides\n- Document architecture"}'
  
  '{"title": "Optimize Gas Usage", "body": "## Description\nHigh gas costs for some operations.\n\n**Impact**: Higher costs for users.\n\n**Solution**: \n- Optimize storage usage\n- Use view/pure functions\n- Batch operations"}'
  
  '{"title": "Add Integration Tests", "body": "## Description\nNo end-to-end tests.\n\n**Impact**: Integration issues may go unnoticed.\n\n**Solution**: \n- Add Cypress/Playwright tests\n- Test user flows"}'
  
  '{"title": "Set Up CI/CD Pipeline", "body": "## Description\nNo automated testing or deployment.\n\n**Impact**: Manual testing and deployment is error-prone.\n\n**Solution**: \n- Set up GitHub Actions\n- Add test automation\n- Implement deployment workflow"}'
)

# Create issues
for issue in "${issues[@]}"; do
  echo "Creating issue: $(echo $issue | jq -r '.title')"
  gh issue create --title "$(echo $issue | jq -r '.title')" --body "$(echo $issue | jq -r '.body')"
done

echo "All issues created successfully!"
