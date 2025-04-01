"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, Coins } from "lucide-react"

interface WalletConnectProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: () => void
}

export function WalletConnect({ open, onOpenChange, onConnect }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (walletType: string) => {
    setConnecting(true)
    setError(null)

    try {
      // ===== DUMMY WALLET CONNECTION CODE =====
      // This is placeholder code. Replace with actual wallet connection logic.
      console.log(`Connecting to ${walletType}...`)

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // REPLACE THIS SECTION WITH ACTUAL WALLET CONNECTION CODE
      // Example for MetaMask:
      // if (walletType === "MetaMask") {
      //   if (!window.ethereum) throw new Error("MetaMask is not installed");
      //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      //   const address = accounts[0];
      //   // Store wallet info in your state management solution
      //   // e.g., localStorage, Redux, Zustand, etc.
      // }

      // Example for WalletConnect:
      // if (walletType === "WalletConnect") {
      //   const connector = new WalletConnect({
      //     bridge: "https://bridge.walletconnect.org",
      //     qrcodeModal: QRCodeModal
      //   });
      //   await connector.createSession();
      //   // Handle connection events
      // }

      // Example for Smart Contract Wallet:
      // if (walletType === "Smart Contract Wallet") {
      //   // Implement connection to smart contract wallet
      //   // e.g., Safe (formerly Gnosis Safe), Argent, etc.
      // }

      // Call onConnect to navigate to dashboard
      onConnect()
    } catch (err) {
      console.error("Wallet connection error:", err)
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err as Error).message
          : "Failed to connect wallet. Please try again.",
      )
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/80 border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect your wallet</DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to Faida</DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">{error}</div>
        )}
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-between p-6 hover:bg-[#9CCD62]/10 transition-all"
            onClick={() => handleConnect("MetaMask")}
            disabled={connecting}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">MetaMask</div>
                <div className="text-xs text-muted-foreground">Connect to your MetaMask wallet</div>
              </div>
            </div>
            {connecting ? (
              <div className="animate-spin h-5 w-5 border-2 border-[#9CCD62] border-t-transparent rounded-full"></div>
            ) : (
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-between p-6 hover:bg-[#9CCD62]/10 transition-all"
            onClick={() => handleConnect("WalletConnect")}
            disabled={connecting}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">WalletConnect</div>
                <div className="text-xs text-muted-foreground">Connect using WalletConnect</div>
              </div>
            </div>
            {connecting ? (
              <div className="animate-spin h-5 w-5 border-2 border-[#9CCD62] border-t-transparent rounded-full"></div>
            ) : (
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-between p-6 hover:bg-[#9CCD62]/10 transition-all"
            onClick={() => handleConnect("Smart Contract Wallet")}
            disabled={connecting}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <Coins className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Smart Contract Wallet</div>
                <div className="text-xs text-muted-foreground">Connect your smart contract wallet</div>
              </div>
            </div>
            {connecting ? (
              <div className="animate-spin h-5 w-5 border-2 border-[#9CCD62] border-t-transparent rounded-full"></div>
            ) : (
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

