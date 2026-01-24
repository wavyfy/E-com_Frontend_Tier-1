export type PincodeResult = {
  city: string;
  state: string;
  country: string;
};

export async function lookupPincode(
  postalCode: string,
): Promise<PincodeResult | null> {
  if (!/^\d{6}$/.test(postalCode)) return null;

  const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
  const data = await res.json();

  if (data[0]?.Status !== "Success") return null;

  const office = data[0].PostOffice[0];
  return {
    city: office.District,
    state: office.State,
    country: "India",
  };
}
