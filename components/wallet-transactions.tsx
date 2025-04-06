"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, RefreshCw, Wallet, Copy, ExternalLink, CheckCircle2 } from "lucide-react"

export function WalletTransactions() {
  const [walletAddress, setWalletAddress] = useState("0x1a2b...3c4d")
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={true} />
      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wallet & Transactions</h1>
              <p className="text-muted-foreground">Manage your wallet connections and view transaction history</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
                <CardDescription>Manage your wallet connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-[#9CCD62]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">MetaMask</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/20">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Wallet Address</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={copyAddress}>
                        {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        <span className="sr-only">Copy address</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">View on explorer</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-muted text-sm font-mono mb-4">{walletAddress}</div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Network</span>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                      Ethereum
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Balance</span>
                    <span className="font-medium">1.24 ETH</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Connection
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View your recent transactions and pending withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-4 w-full max-w-md">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="yields">Yields</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Deposit to Balanced Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 28, 2025 • 2 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">1,000 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yield Harvested</p>
                          <p className="text-xs text-muted-foreground">Mar 25, 2025 • 5 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">45.32 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Deposit to Growth Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 22, 2025 • 1 week ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">2,500 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <ArrowDownRight className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Withdrawal from Stable Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 15, 2025 • 2 weeks ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">500 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Portfolio Rebalanced</p>
                          <p className="text-xs text-muted-foreground">Mar 10, 2025 • 3 weeks ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">-</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="deposits" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Deposit to Balanced Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 28, 2025 • 2 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">1,000 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Deposit to Growth Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 22, 2025 • 1 week ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">2,500 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="withdrawals" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <ArrowDownRight className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Withdrawal from Stable Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 15, 2025 • 2 weeks ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">500 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border bg-orange-500/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <ArrowDownRight className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Withdrawal from Impact Portfolio</p>
                          <p className="text-xs text-muted-foreground">Mar 30, 2025 • Today</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">750 USDC</p>
                        <p className="text-xs text-amber-500">Pending</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="yields" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yield Harvested</p>
                          <p className="text-xs text-muted-foreground">Mar 25, 2025 • 5 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">45.32 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yield Harvested</p>
                          <p className="text-xs text-muted-foreground">Mar 18, 2025 • 12 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">38.75 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yield Harvested</p>
                          <p className="text-xs text-muted-foreground">Mar 11, 2025 • 19 days ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">42.18 USDC</p>
                        <p className="text-xs text-green-500">Completed</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>Pending Withdrawals</CardTitle>
              <CardDescription>Track the status of your pending withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg border border-border bg-orange-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <ArrowDownRight className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Withdrawal from Impact Portfolio</p>
                      <p className="text-xs text-muted-foreground">Requested on Mar 30, 2025</p>
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-medium">750 USDC</p>
                    <p className="text-xs text-amber-500">Processing</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Estimated completion</p>
                    <p className="text-xs text-muted-foreground">Mar 31, 2025 (24h)</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Withdrawals typically process within 24 hours. Larger amounts may take up to 72 hours due to
                    protocol unbonding periods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

