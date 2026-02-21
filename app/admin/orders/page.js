"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusColors = {
    Pending: "bg-gray-100 text-gray-600",
    Processing: "bg-blue-100 text-blue-600",
    Shipped: "bg-orange-100 text-orange-600",
    Delivered: "bg-emerald-100 text-emerald-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-950 tracking-tighter">
            Order Management
          </h1>
          <p className="text-gray-400 font-medium tracking-tight">
            Track, fulfill, and manage your packaging shipments.
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gray-50 border border-gray-100 text-gray-950 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">
          <Download size={20} />
          EXPORT ORDERS
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="bg-transparent outline-none w-full text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map(
            (tab) => (
              <button
                key={tab}
                className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-100 hover:border-gray-950 transition-all text-gray-400 hover:text-gray-950"
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Package className="text-gray-300" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Fetching Order History...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-950">
                No orders yet
              </h3>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Order Info
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Items
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Total
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-950">
                        {order.orderId}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-950">
                        {order.customer.name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-gray-500 line-clamp-1">
                        {order.items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-gray-950">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer ${statusColors[order.status] || "bg-gray-100"}`}
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <button className="p-3 bg-gray-50 group-hover:bg-white rounded-xl transition-all">
                        <Eye
                          size={18}
                          className="text-gray-400 group-hover:text-gray-950"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
