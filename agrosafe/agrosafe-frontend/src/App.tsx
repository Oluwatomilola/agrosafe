import React from 'react'
import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

// Contract ABI
const contractABI = [
  "function registerFarmer(string name, string location) external",
  "function verifyFarmer(uint256 farmerId, bool status) external",
  "function recordProduce(string cropType, string harvestDate) external",
  "function certifyProduce(uint256 produceId, bool certified) external",
  "function totalFarmers() external view returns (uint256)",
  "function totalProduce() external view returns (uint256)",
  "function farmers(uint256) external view returns (uint256, string, address, string, bool)",
  "function produce(uint256) external view returns (uint256, uint256, string, string, bool)"
]
