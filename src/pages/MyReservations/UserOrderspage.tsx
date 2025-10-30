import OrderStatusCard from "@/components/OrderStatusCard";
import FooterNav from "@/layout/FooterNav";

export default function UserOrdersPage() {
  return (
    <div>
      <h1 className="text-[20px] font-bold my-6">OO님의 주문 내역</h1>
      <OrderStatusCard />
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </div>
  );
}
