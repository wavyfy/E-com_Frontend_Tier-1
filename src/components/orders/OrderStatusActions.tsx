// "use client";

// import { useState } from "react";
// import { OrderAPI } from "@/lib/api/order.api";

// type Props = {
//   order: {
//     _id: string;
//     status: "PENDING" | "COMPLETED";
//   };
// };

// export default function OrderStatusActions({ order }: Props) {
//   const [loading, setLoading] = useState(false);

//   if (order.status === "COMPLETED") {
//     return (
//       <div className="text-sm text-gray-500">
//         Order is completed and locked.
//       </div>
//     );
//   }

//   async function markCompleted() {
//     setLoading(true);
//     await OrderAPI.adminUpdateStatus(order._id, "COMPLETED");
//     window.location.reload();
//   }

//   return (
//     <div className="flex gap-3">
//       <button
//         disabled={loading}
//         onClick={markCompleted}
//         className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
//       >
//         Mark as Completed
//       </button>
//     </div>
//   );
// }
