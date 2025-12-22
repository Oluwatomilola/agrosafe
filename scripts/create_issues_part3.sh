#!/bin/bash

# Create issues 11-15
gh issue create --title "Add Form Validation" --body "## Description
Forms lack client-side validation.

**Impact**: Poor UX and unnecessary blockchain transactions.

**Solution**: 
- Add form validation using Formik/Yup
- Show clear error messages"

echo "Created issue 11/20"

gh issue create --title "Secure Environment Variables" --body "## Description
Sensitive data might be exposed in client-side code.

**Impact**: Security risk if sensitive data is exposed.

**Solution**: 
- Use Vite environment variables
- Add input validation
- Implement proper error handling"

echo "Created issue 12/20"

gh issue create --title "Implement Rate Limiting" --body "## Description
No rate limiting on public functions.

**Impact**: Potential for spam or denial of service.

**Solution**: 
- Implement rate limiting
- Add circuit breakers"

echo "Created issue 13/20"

gh issue create --title "Add Input Sanitization" --body "## Description
User inputs are not sanitized.

**Impact**: Potential XSS vulnerabilities.

**Solution**: 
- Implement input sanitization
- Use DOMPurify or similar"

echo "Created issue 14/20"

gh issue create --title "Implement Contract Upgradeability" --body "## Description
No upgrade pattern implemented.

**Impact**: Hard to fix bugs or upgrade functionality.

**Solution**: 
- Use OpenZeppelin Upgrades
- Implement proxy pattern"

echo "Created issue 15/20"

echo "Please run the next script to create the final set of issues (16-20)"
