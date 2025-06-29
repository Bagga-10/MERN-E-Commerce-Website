import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading, refetch } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [chartType, setChartType] = useState("bar");

  const [state, setState] = useState({
    options: {
      chart: {
        type: chartType,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#6366F1"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Sales Over Time",
        align: "left",
        style: { fontSize: "18px", fontWeight: "bold" },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        hover: { size: 6 },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Total Sales ($)",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          chart: {
            ...prevState.options.chart,
            type: chartType,
          },
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }

    refetch();
  }, [salesDetail, chartType, refetch]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0 px-8 py-10">
        {/* Stats Section */}
        <div className="ml-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-[90rem]">
          {[
            {
              title: "Sales",
              icon: "$",
              value: isLoading ? <Loader /> : `$${sales?.totalSales.toFixed(2)}`,
              color: "bg-gradient-to-r from-purple-500 to-indigo-500",
            },
            {
              title: "Customers",
              icon: "👤",
              value: loading ? <Loader /> : customers?.length,
              color: "bg-gradient-to-r from-pink-500 to-red-500",
            },
            {
              title: "All Orders",
              icon: "🛒",
              value: loadingTwo ? <Loader /> : orders?.totalOrders,
              color: "bg-gradient-to-r from-green-400 to-emerald-600",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`rounded-xl shadow-xl p-6 transition-transform hover:scale-105 ${card.color} text-white`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="text-md font-medium">{card.title}</p>
              <h1 className="text-2xl font-bold mt-1">{card.value}</h1>
            </div>
          ))}
        </div>

        {/* Chart Controls */}
        <div className="mt-12 flex items-center justify-between w-[90%]">
          <h2 className="text-2xl font-semibold">Sales Analytics</h2>
          <div>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="border px-3 py-1 rounded shadow-sm"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center mt-6 ">
          <Chart
            options={state.options}
            series={state.series}
            type={chartType}
            width="300%"
            height={400}
          />
        </div>

        {/* Order List */}
        <div className="mt-16">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
