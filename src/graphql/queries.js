export const GET_WALLETS = `
query {
  paymentServiceProvider{
     edges{
       node{
        PSPName,
         uuid,
         PSPAccount,
         Pin
       }
     }
    }
}
`;

export const INITIATE_TRANSACTION = (amount, serviceProvider, insureeUuid) => {
  return `
       mutation InitiateTransaction {
         initiateTransaction(
        input: {
            amount:${amount},
            paymentServiceProviderUuid:"${serviceProvider}",
            insureeUuid:"${insureeUuid}" ,
        }
            ) {
            internalId
            clientMutationId
            uuids
            } 
        }

   `;
};

export const PROCESS_TRANSACTION = (
  amount,
  serviceProvider,
  insureeUuid,
  otp,
  transactionId
) => {
  return `
    mutation {
      processTransaction(input: {
        otp:"${otp}",  
        amount:${amount}, 
        insureeUuid:"${insureeUuid}", 
        paymentServiceProviderUuid:"${serviceProvider}",
        uuid:"${transactionId}"
      }) {
        clientMutationId
        internalId
      }
    }
    `;
};
