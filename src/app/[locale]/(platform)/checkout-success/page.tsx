import stripe from "@/app/services/stripe";
import ClearCartComponent from "./ClearCartComponent";

const CheckoutSuccessPage = async ({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) => {
  let orderDetails = null;
  const { session_id } = await searchParams;

  if (session_id) {
    orderDetails = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  }

  console.log("Order Details:", orderDetails?.metadata);

  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-5xl font-times mt-4 font-semibold text-gray-100">
            Thanks for your purchase!
          </h1>
        </div>
      </header>
      <div>
        <h1>Thanks for your purchase!</h1>
        {orderDetails && (
          <div>
            <h2>Order Summary</h2>
            <p>Total: €{(orderDetails.amount_total! / 100).toFixed(2)}</p>
            <ul>
              {orderDetails.line_items?.data.map((item) => (
                <li key={item.id}>{item.description}</li>
              ))}
            </ul>
          </div>
        )}

        <ClearCartComponent />
      </div>
    </>
  );
};

export default CheckoutSuccessPage;
