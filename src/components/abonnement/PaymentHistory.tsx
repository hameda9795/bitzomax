'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Download, Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for transactions
const transactions = [
  {
    id: "INV-2505-1001",
    date: "2025-05-03",
    amount: "€9.99",
    type: "Abonnement",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2504-1205",
    date: "2025-04-03",
    amount: "€9.99",
    type: "Abonnement",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2503-1102",
    date: "2025-03-03",
    amount: "€9.99",
    type: "Abonnement",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2502-1054",
    date: "2025-02-03",
    amount: "€9.99",
    type: "Abonnement",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2501-0987",
    date: "2025-01-03",
    amount: "€9.99",
    type: "Abonnement",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2412-0876",
    date: "2024-12-03",
    amount: "€7.99",
    type: "Abonnement (Promotie)",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2411-0766",
    date: "2024-11-03",
    amount: "€7.99",
    type: "Abonnement (Promotie)",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "INV-2410-0611",
    date: "2024-10-03",
    amount: "€7.99",
    type: "Abonnement (Promotie)",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "REFUND-2410-0012",
    date: "2024-10-15",
    amount: "€4.99",
    type: "Terugbetaling",
    status: "Voltooid",
    paymentMethod: "VISA ****1234",
  },
  {
    id: "ADD-2410-0028",
    date: "2024-10-10",
    amount: "€4.99",
    type: "Add-on pakket",
    status: "Betaald",
    paymentMethod: "VISA ****1234",
  }
];

type DateFilterType = {
  from?: Date;
  to?: Date;
};

export const PaymentHistory = () => {
  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({});
  
  // Unique statuses and types for filter options
  const uniqueStatuses = Array.from(new Set(transactions.map(t => t.status)));
  const uniqueTypes = Array.from(new Set(transactions.map(t => t.type)));
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d MMMM yyyy", { locale: nl });
  };
  
  // Filtered transactions based on all filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = search === "" || 
      transaction.id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
      transaction.date.includes(search);
    
    // Status filter
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    
    // Type filter
    const matchesType = !typeFilter || transaction.type === typeFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter.from) {
      matchesDate = matchesDate && isAfter(parseISO(transaction.date), dateFilter.from);
    }
    if (dateFilter.to) {
      matchesDate = matchesDate && isBefore(parseISO(transaction.date), dateFilter.to);
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter(null);
    setTypeFilter(null);
    setDateFilter({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Betalingsgeschiedenis</CardTitle>
        <CardDescription>
          Een overzicht van al je betalingen en facturen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Zoeken</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Factuurnummer of betaalmethode..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-[180px] space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={statusFilter || "all"} 
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Alle statussen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select 
                value={typeFilter || "all"} 
                onValueChange={(value) => setTypeFilter(value === "all" ? null : value)}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Alle types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-[220px] space-y-2">
              <Label>Periode</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      (dateFilter.from || dateFilter.to) && "text-primary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter.from ? (
                      dateFilter.to ? (
                        <>
                          {format(dateFilter.from, "d LLL y", { locale: nl })} -{" "}
                          {format(dateFilter.to, "d LLL y", { locale: nl })}
                        </>
                      ) : (
                        <>Vanaf {format(dateFilter.from, "d LLL y", { locale: nl })}</>
                      )
                    ) : dateFilter.to ? (
                      <>Tot {format(dateFilter.to, "d LLL y", { locale: nl })}</>
                    ) : (
                      "Selecteer periode"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 flex-col space-y-4" align="start">
                  <div className="p-3 border-b">
                    <div className="space-y-2">
                      <h4 className="font-medium">Selecteer periode</h4>
                      <p className="text-sm text-muted-foreground">
                        Kies een startdatum en einddatum
                      </p>
                    </div>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateFilter.from}
                    selected={{
                      from: dateFilter.from,
                      to: dateFilter.to,
                    }}
                    onSelect={(range) => {
                      setDateFilter({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    locale={nl}
                  />
                  <div className="p-3 border-t flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDateFilter({})}
                    >
                      Reset
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={resetFilters}
              className="md:self-end"
            >
              Reset filters
            </Button>
          </div>
        </div>
        
        {/* Transactions table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[160px]">Factuurnummer</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Betaalmethode</TableHead>
                <TableHead className="text-right">Factuur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        transaction.status === "Betaald" || transaction.status === "Voltooid"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                      }>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Download factuur">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Geen transacties gevonden die aan je filters voldoen.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Totaal: {filteredTransactions.length} transacties
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export als CSV
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentHistory;