import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { client, databases, getOrder, getActiveOrder, functions } from "~/lib/appwrite";
import { useGlobalContext } from "./GlobalProvider";
import CryptoJS from "crypto-js";
import { router } from "expo-router";

const OrderContext = createContext({});

const OrderProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const [order, setOrder] = useState(null);
  // Fetch order by ID and set state
  const fetchOrder = useCallback(async (id) => {
    if (!id) {
      console.warn("Order ID is missing");
      setOrder(null);
      return;
    }
  
    try {
      const fetchedOrder = await getOrder(id);
      if (!fetchedOrder) {
        console.warn(`No order found or data is invalid for ID: ${id}`);
        setOrder(null);
      } else {
        setOrder(fetchedOrder);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }, []); // No dependencies, as this function should remain stable
  
  useEffect(() => {
    if (!user?.$id) return;

    const fetchActiveOrder = async () => {
      try {
        const activeOrder = await getActiveOrder(user.$id);
        console.log("Active Order Fetch Result:", activeOrder);
  
        if (activeOrder) {
          console.log("It worked!");
          setOrder(activeOrder);
        } else {
          console.log("It didn't work");
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching active order:", error);
      }
    };
  
    fetchActiveOrder();
  }, [user?.$id])

  // Update order document
  const updateOrder = async (fields) => {
    if (!order?.$id) return;

    try {
      await databases.updateDocument(
        "669a5a3d003d47ff98c7",
        "6731ec1a001ab4994c0c",
        order.$id,
        fields
      );
      fetchOrder(order.$id); // Update local state
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Subscribe to order updates
  useEffect(() => {
    if (!order?.$id) return;

    const unsubscribe = client.subscribe(
      `databases.${'669a5a3d003d47ff98c7'}.collections.${'6731ec1a001ab4994c0c'}.documents.${order.$id}`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.update")) {
          const updatedFields = response.payload;
          if (updatedFields && updatedFields.orderStatus !== order.orderStatus) {
            fetchOrder(order.$id); // Only fetch if relevant fields change
          }
        }
      }
    );

    return () => unsubscribe();
  }, [order?.$id, order?.orderStatus]);

  // Accept the order
  const acceptOrder = async () => {
    try {
      await updateOrder({ orderStatus: "ACCEPTED", driverId: user?.$id });
      // Call the serverless function here if needed
      await functions.createExecution('677fb361000fe24800a5', JSON.stringify({ orderId: order.$id }));
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  // Pick up the order
  const pickUpOrder = () => updateOrder({ orderStatus: "PICKED_UP" });

  // Complete the order
  const completeOrder = async (enteredOtp) => {
    try {
      // Fetch the hashed OTP from the order (assumes it's stored in `order.otp`)
      const hashedOtp = order?.otp;
      if (!hashedOtp) {
        throw new Error("No OTP found for this order.");
      }
  
      // Hash the entered OTP to compare with the stored hashed OTP
      const hashedEnteredOtp = CryptoJS.SHA256(enteredOtp).toString(CryptoJS.enc.Base64);
  
      // Compare the entered OTP (hashed) with the stored hashed OTP
      if (hashedEnteredOtp !== hashedOtp) {
        console.error("Invalid OTP entered.");
        throw new Error("Invalid OTP. Please try again.");
      }
  
      // If OTP is valid, proceed to complete the order
      await updateOrder({ orderStatus: "COMPLETED" });
      router.push("/home");
      setOrder(null); // Set order to null after completion
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        fetchOrder,
        acceptOrder,
        pickUpOrder,
        completeOrder,
        order,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

export const useOrderContext = () => useContext(OrderContext);
