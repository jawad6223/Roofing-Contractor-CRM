import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { purchaseFormType } from "@/types/DashboardTypes";
import { fetchLeadPrice } from "@/lib/leadPrice";

const PurchaseLeads = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pricePerLead, setPricePerLead] = useState<number>(0);
  const router = useRouter();
  const [purchaseForm, setPurchaseForm] = useState<purchaseFormType>({ quantity: "1" });

  useEffect(() => {
    const fetchLeadPriceData = async () => {
      const leadPriceData = await fetchLeadPrice();
      if (leadPriceData) {
        setPricePerLead((leadPriceData)['Price Per Lead']);
      }
    };
    fetchLeadPriceData();
  }, []);
  

  const handlePurchaseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "quantity") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setPurchaseForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setPurchaseForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  async function handlePurchaseSubmitStripe(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: purchaseForm.quantity,
          leadAmount: pricePerLead,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout error:", errorData.error);
        return;
      }

      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Premium Leads</h2>
          <p className="text-gray-600">Get high-quality roofing leads delivered to your dashboard</p>
        </div>
      </div>

      <Card className="border-0 shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-[#286BBD]" />
            <span className="text-[#286BBD]">Purchase New Leads</span>
          </CardTitle>
          <CardDescription>Specify your target area and quantity to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePurchaseSubmitStripe} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity *</label>
                <Input
                  name="quantity"
                  type="number"
                  value={purchaseForm.quantity}
                  onChange={handlePurchaseInputChange}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="1"
                  required
                  className="h-10 text-sm"
                />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Lead Price:</span>
                  <span className="text-lg font-bold text-[#286BBD]">${pricePerLead} per lead</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Quantity:</span>
                  <span className="text-sm text-gray-600">{purchaseForm.quantity} leads</span>
                </div>
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-[#286BBD]">
                    ${(parseInt(purchaseForm.quantity) * pricePerLead) ? (parseInt(purchaseForm.quantity) * pricePerLead) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                disabled={isLoading || purchaseForm.quantity === "0" || purchaseForm.quantity === ""}
                type="submit"
                className="px-6 py-2 text-sm bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase Leads
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseLeads;