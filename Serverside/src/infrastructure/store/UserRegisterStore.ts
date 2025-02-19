export class UserRegistrationStore {
    private static instance: UserRegistrationStore;
    private users: Map<string, any>;
  
    private constructor() {
      this.users = new Map(); // Key: email, Value: user data
    }
  
    static getInstance(): UserRegistrationStore {
      if (!UserRegistrationStore.instance) {
        UserRegistrationStore.instance = new UserRegistrationStore();
      }
      return UserRegistrationStore.instance;
    }
  
    addUser(email: string, userData: any) {
      this.users.set(email, userData);
    }
  
    getUser(email: string) {
      return this.users.get(email);
    }
  clearUser(){
    this.users.clear()
  }
  
    removeUser(email: string) {
      this.users.delete(email);
    }
    
  }
  