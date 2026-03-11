import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  // Persistent state

  // External mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Product = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    sizes : [Text];
    imageId : Text;
    stock : Nat;
    featured : Bool;
    createdAt : Int;
  };

  module Product {
    public func compareByCreatedAt(p1 : Product, p2 : Product) : Order.Order {
      Int.compare(p1.createdAt, p2.createdAt);
    };
  };

  let products = Map.empty<Text, Product>();

  // Admin functions
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  // Public queries
  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().filter(func(p) { Text.equal(p.category, category) }).toArray();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().filter(func(p) { p.featured }).toArray().sort(Product.compareByCreatedAt);
  };

  public query ({ caller }) func searchProducts(queryText : Text) : async [Product] {
    let lowerQuery = queryText.toLower();
    products.values().toArray().filter(
      func(p) {
        p.name.toLower().contains(#text lowerQuery) or p.description.toLower().contains(#text lowerQuery);
      }
    );
  };

  public query ({ caller }) func getProductCount() : async Nat {
    products.size();
  };
};
