export const GET_WALLETS = `
query {
  paymentServiceProvider{
     edges{
       node{
         name,
         uuid,
         account,
         pin
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
              Success
              responseMessage
              uuids
              detail
              clientMutationId
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
        
        responseCode
        responseMessage
        clientMutationId
        Success
        detail
        clientMutationId
      }
    }
    `;
};
