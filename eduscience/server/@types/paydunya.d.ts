declare module 'paydunya' {
    class Setup {
      constructor(options: { masterKey: string; privateKey: string; publicKey: string; token: string; mode: string });
      // Ajoutez ici les méthodes et propriétés de la classe Setup que vous utilisez
    }
  
    class Store {
      constructor(options: { name: string; tagline: string; phoneNumber: string; postalAddress: string });
      // Ajoutez ici les méthodes et propriétés de la classe Store que vous utilisez
    }
  
    class Invoice {
      constructor(options: { setup: Setup; store: Store });
      addItem(description: string, quantity: number, unitPrice: number, totalPrice: number): void;
      // Ajoutez ici les méthodes et propriétés de la classe Invoice que vous utilisez
      create(): Promise<boolean>;
      confirm(token: string): Promise<boolean>;
      status: string;
      url: string;
      responseText: string;
      totalAmount: number;
    }
  
    export = { Setup, Store, Invoice };
  }
  