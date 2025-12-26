# 📖 AgroSafe User Guides

Welcome to AgroSafe! This comprehensive guide will help you navigate and use the platform effectively. Choose your role below to get started.

## Table of Contents

1. [Getting Started](#getting-started)
2. [For Farmers](#for-farmers)
3. [For Administrators](#for-administrators)
4. [For General Users](#for-general-users)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#frequently-asked-questions)

## Getting Started

### What is AgroSafe?

AgroSafe is a blockchain-based agricultural traceability platform that enables:
- **Farmers**: Register your farm and record produce for verification
- **Administrators**: Verify farmers and certify produce quality
- **Consumers**: Trace the origin and certification of agricultural products

### Prerequisites

Before using AgroSafe, ensure you have:

1. **Web3 Wallet**: Install MetaMask or compatible wallet extension
2. **Test Tokens**: For testing, get Sepolia test ETH from a faucet
3. **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Connecting Your Wallet

1. **Install Wallet**: Download and install MetaMask from [metamask.io](https://metamask.io)
2. **Create Account**: Set up your wallet account
3. **Switch Network**: Change to Sepolia testnet for testing
4. **Connect to AgroSafe**: Click "Connect Wallet" on the AgroSafe website

## For Farmers

### Step-by-Step Registration Process

#### 1. Access Registration
- Navigate to the AgroSafe homepage
- Click "Register" in the navigation menu
- Ensure your wallet is connected

#### 2. Fill Registration Form
```
Name: [Your full legal name - 2-100 characters]
Location: [Your farm location - 3-200 characters]
```

#### 3. Submit Registration
- Review your information carefully
- Click "Register Farmer"
- Confirm the transaction in your wallet
- Wait for blockchain confirmation

#### 4. Verification Process
- **Status**: Check "Dashboard" to see your verification status
- **Waiting Period**: Admin must manually verify all registrations
- **Notification**: You'll see status updates in the interface

### Recording Produce

#### Prerequisites
- ✅ **Wallet Connected**: Your wallet must be connected
- ✅ **Registration Complete**: You must be registered
- ✅ **Verification Approved**: Admin must have verified your account

#### Recording Steps

1. **Navigate to Produce Page**
   - Click "Produce" in the navigation menu

2. **Fill Produce Information**
   ```
   Crop Type: [e.g., "Wheat", "Corn", "Rice" - 2-50 characters]
   Harvest Date: [YYYY-MM-DD format, e.g., "2023-12-01"]
   ```

3. **Submit Produce Record**
   - Click "Record Produce"
   - Confirm transaction in wallet
   - Wait for blockchain confirmation

4. **View Your Records**
   - Check "Dashboard" to see all your recorded produce
   - Note your unique produce IDs for future reference

### Managing Your Farm Data

#### Viewing Your Profile
- **Dashboard Access**: Click "Dashboard" to view your profile
- **Verification Status**: Check if you're verified (required for produce recording)
- **Farm Statistics**: View total registered farmers and produce items

#### Updating Information
- **Current Limitation**: You cannot modify registered information directly
- **Contact Admin**: For changes, contact the system administrator
- **Re-registration**: In some cases, you may need to re-register

#### Best Practices

1. **Accurate Information**
   - Use your legal name for verification
   - Provide precise location details
   - Double-check all dates and crop types

2. **Regular Updates**
   - Record produce immediately after harvest
   - Keep accurate harvest date records
   - Monitor your verification status

3. **Security Tips**
   - Never share your private keys
   - Use a secure wallet password
   - Regularly backup your wallet

## For Administrators

### Admin Dashboard Overview

#### Accessing Admin Functions
- Click "Admin" in the navigation menu
- Ensure your wallet has admin privileges
- View pending farmer registrations and produce records

#### Verification Workflow
1. **Review Pending Farmers**
   - View unverified farmer registrations
   - Check provided information for accuracy
   - Verify location and identity details

2. **Approve/Reject Registration**
   - Click "Verify Farmer" for approved registrations
   - Set verification status (true = approved, false = rejected)
   - Confirm transaction in wallet

#### Produce Certification Process

1. **Review Produce Records**
   - View all recorded produce items
   - Check farmer verification status
   - Validate crop types and harvest dates

2. **Certify Produce**
   - Click "Certify Produce" for quality items
   - Set certification status
   - Confirm transaction in wallet

### Admin Best Practices

#### Verification Guidelines
- **Identity Verification**: Verify farmer identity before approval
- **Location Validation**: Confirm farm locations are accurate
- **Documentation**: Keep records of verification decisions

#### Certification Standards
- **Quality Assessment**: Certify only verified quality produce
- **Timely Processing**: Review and certify produce promptly
- **Audit Trail**: Maintain records of all certification decisions

#### Security Considerations
- **Admin Wallet Security**: Protect admin wallet keys
- **Transaction Verification**: Always verify transaction details
- **Access Control**: Ensure only authorized admins can verify farmers

## For General Users

### Understanding the Platform

#### What You Can Do
- **View Statistics**: Check total farmers and produce counts
- **Browse Data**: View farmer and produce information
- **Trace Products**: Follow produce from farm to certification

#### What You Cannot Do
- **Register Farmers**: Only farmers can register themselves
- **Record Produce**: Only verified farmers can record produce
- **Certify Products**: Only admins can certify produce

### Using the Dashboard

#### Dashboard Features
- **Total Statistics**: View system-wide farmer and produce counts
- **Recent Activity**: See latest farmer registrations and produce records
- **Navigation**: Easy access to all platform features

#### Traceability Features
- **Farm Origin**: Track produce back to its farm
- **Farmer Verification**: Check if farmer is verified
- **Certification Status**: See if produce is certified

### Interpreting Data

#### Farmer Information
```
Name: [Farmer's registered name]
Location: [Farm location]
Verified: [✅ Yes / ❌ No]
ID: [Unique farmer identifier]
```

#### Produce Information
```
Crop Type: [Type of crop]
Harvest Date: [When it was harvested]
Certified: [✅ Yes / ❌ No]
Farmer: [Associated farmer information]
```

## Troubleshooting

### Common Issues and Solutions

#### Wallet Connection Problems

**Issue**: Cannot connect wallet
**Solutions**:
1. Ensure wallet extension is installed
2. Refresh the page and try again
3. Check if wallet is unlocked
4. Clear browser cache and cookies

**Issue**: Wrong network detected
**Solutions**:
1. Switch to Sepolia testnet in MetaMask
2. Check network settings in wallet
3. Restart browser if necessary

#### Registration Issues

**Issue**: Registration transaction failed
**Solutions**:
1. Check you have sufficient test ETH for gas fees
2. Ensure name and location meet length requirements
3. Verify you haven't registered before
4. Try refreshing and attempting again

**Issue**: Farmer already registered error
**Solutions**:
1. Check if you're already registered
2. Verify you're using the correct wallet address
3. Contact admin if you need to update information

#### Produce Recording Issues

**Issue**: Cannot record produce
**Solutions**:
1. Ensure you're a verified farmer
2. Check crop type and date format
3. Verify wallet is still connected
4. Ensure contract is not paused

#### General Interface Issues

**Issue**: Page not loading properly
**Solutions**:
1. Refresh the browser page
2. Clear browser cache
3. Check internet connection
4. Try using incognito/private browsing mode

### Error Messages

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| "Farmer not registered" | Wallet address not found in registry | Register first |
| "Farmer not verified" | Registration not yet approved | Wait for admin verification |
| "Invalid produce ID" | Produce ID doesn't exist | Check ID validity |
| "Contract paused" | Admin has paused operations | Wait for unpause |
| "Gas estimation failed" | Transaction may fail | Check input validity |

### Getting Help

#### Self-Help Resources
1. **Documentation**: Check this guide and API docs
2. **FAQ Section**: Review common questions below
3. **Error Messages**: Look up specific error meanings

#### Contact Support
- **GitHub Issues**: Report bugs via GitHub Issues
- **Community**: Join discussions for help
- **Documentation**: Check updated guides

## Frequently Asked Questions

### General Questions

**Q: What is blockchain and why does AgroSafe use it?**
A: Blockchain provides immutable, transparent record-keeping. Once data is recorded, it cannot be altered, ensuring the integrity of farmer and produce information.

**Q: Do I need to pay to use AgroSafe?**
A: Using the platform is free, but blockchain transactions require small gas fees. For testing, use Sepolia testnet with free test ETH.

**Q: Can I use AgroSafe on mobile?**
A: Yes! The interface is responsive and works on mobile devices. However, you'll need a mobile wallet app for transactions.

### Farmer-Specific Questions

**Q: How long does verification take?**
A: Verification time depends on admin review. It can range from minutes to several days. Check your dashboard for status updates.

**Q: Can I edit my registration information?**
A: Currently, registration information cannot be directly edited. Contact an administrator for changes.

**Q: What if I recorded produce with wrong information?**
A: Produce records cannot be modified once submitted. Contact an administrator if major corrections are needed.

**Q: How many produce items can I record?**
A: There's no limit on the number of produce items you can record.

### Administrator Questions

**Q: How do I verify a farmer?**
A: Go to Admin panel, find the farmer, and use the verify function. Only verified farmers can record produce.

**Q: What criteria should I use for verification?**
A: Verify farmers based on identity verification, location accuracy, and compliance with platform requirements.

**Q: Can I revoke farmer verification?**
A: Yes, you can set verification status to false to revoke verification.

### Technical Questions

**Q: What blockchain network does AgroSafe use?**
A: Currently deployed on Ethereum Sepolia testnet for testing. Mainnet deployment planned for production use.

**Q: What wallet browsers are supported?**
A: All major browsers with Web3 wallet support (Chrome, Firefox, Safari, Edge) and mobile wallets.

**Q: Is my data private?**
A: All blockchain data is public by design. Only register information you're comfortable making public.

**Q: What happens if I lose access to my wallet?**
A: Without your private keys, you cannot access your account. Always backup your wallet and keep keys secure.

### Security Questions

**Q: Is my private key stored on AgroSafe servers?**
A: No. Private keys never leave your device. AgroSafe cannot access your funds or account.

**Q: How secure is my information?**
A: Information is secured by blockchain cryptography. Once recorded, it's immutable and tamper-resistant.

**Q: What if someone hacks the system?**
A: The smart contract is immutable once deployed. Security relies on proper admin practices and secure wallet management.

---

*This guide is continuously updated. For the latest information, check the official documentation or contact support.*