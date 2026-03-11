import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { CATEGORIES, formatPrice } from "../data/sampleProducts";
import { useActor } from "../hooks/useActor";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

const EMPTY_FORM: Omit<Product, "id" | "createdAt"> = {
  name: "",
  category: "Perfume",
  description: "",
  price: BigInt(0),
  sizes: ["30ml", "50ml"],
  imageId: "",
  stock: BigInt(0),
  featured: false,
};

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { upload, uploading, progress } = useBlobStorage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] =
    useState<Omit<Product, "id" | "createdAt">>(EMPTY_FORM);
  const [sizesInput, setSizesInput] = useState("30ml, 50ml");
  const [enablingAdmin, setEnablingAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setSizesInput("30ml, 50ml");
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      sizes: product.sizes,
      imageId: product.imageId,
      stock: product.stock,
      featured: product.featured,
    });
    setSizesInput(product.sizes.join(", "));
    setImageFile(null);
    setImagePreview(product.imageId || null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    let imageId = form.imageId;

    if (imageFile) {
      try {
        imageId = await upload(imageFile);
      } catch {
        toast.error("Image upload failed");
        return;
      }
    }

    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const productData: Product = {
      id: editingProduct?.id ?? crypto.randomUUID(),
      name: form.name,
      category: form.category,
      description: form.description,
      price: form.price,
      sizes,
      imageId,
      stock: form.stock,
      featured: form.featured,
      createdAt: editingProduct?.createdAt ?? BigInt(Date.now() * 1000000),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(productData);
        toast.success("Product created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEnableAdmin = async () => {
    if (!identity || !actor) {
      toast.error("Please login first");
      return;
    }
    if (!adminToken.trim()) {
      toast.error("Please enter the admin token");
      return;
    }
    setEnablingAdmin(true);
    try {
      await actor._initializeAccessControlWithSecret(adminToken);
      await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      toast.success("Admin role assigned!");
    } catch {
      toast.error("Invalid token or admin already assigned");
    } finally {
      setEnablingAdmin(false);
    }
  };

  const isSaving =
    createProduct.isPending || updateProduct.isPending || uploading;

  // --- Not authenticated ---
  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm mx-auto px-4"
          data-ocid="admin.login.panel"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">
            Connect your identity to access the admin dashboard.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="btn-gold px-10 py-5 rounded-full text-sm tracking-widest uppercase w-full"
            data-ocid="admin.login.primary_button"
          >
            {loginStatus === "logging-in" && (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            )}
            {loginStatus === "logging-in"
              ? "Connecting..."
              : "Connect Identity"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Loading admin status ---
  if (adminLoading) {
    return (
      <div
        className="pt-28 pb-20 min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- Not admin ---
  if (!isAdmin) {
    const sessionExpired = !actor;
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm mx-auto px-4"
          data-ocid="admin.access_denied.panel"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">
            Your account doesn't have admin access. Enable admin for first-time
            setup.
          </p>
          <div className="text-xs text-muted-foreground/60 font-mono break-all p-3 bg-muted/30 rounded-lg">
            {identity.getPrincipal().toString()}
          </div>

          {/* Session expired warning + re-login */}
          {sessionExpired && (
            <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Your session may have expired. Please reconnect your identity
                before enabling admin.
              </p>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="btn-gold px-6 py-4 rounded-full text-xs tracking-widest uppercase w-full"
                data-ocid="admin.relogin.primary_button"
              >
                {loginStatus === "logging-in" ? (
                  <>
                    <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  "Reconnect Identity"
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2 text-left">
            <Label
              htmlFor="adminToken"
              className="text-xs uppercase tracking-wider"
            >
              Admin Secret
            </Label>
            <Input
              id="adminToken"
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter admin token"
              className="bg-muted/30 border-border/60"
              data-ocid="admin.token.input"
            />
          </div>
          <Button
            onClick={handleEnableAdmin}
            disabled={enablingAdmin || !actor}
            className="btn-gold px-10 py-5 rounded-full text-sm tracking-widest uppercase w-full"
            data-ocid="admin.enable_admin.primary_button"
          >
            {enablingAdmin && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {enablingAdmin ? "Enabling..." : "Enable Admin"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Admin Dashboard ---
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-1">
              Admin Panel
            </p>
            <h1 className="font-display text-3xl font-bold">
              Product Management
            </h1>
          </div>
          <Button
            onClick={openCreate}
            className="btn-gold px-6 py-5 text-sm tracking-wider uppercase rounded-full"
            data-ocid="admin.add_product.primary_button"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Product
          </Button>
        </div>

        <Separator className="mb-8 bg-border/40" />

        {/* Products Table */}
        {productsLoading ? (
          <div className="space-y-4" data-ocid="admin.products.loading_state">
            {Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((k) => (
              <Skeleton key={k} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (products ?? []).length === 0 ? (
          <div
            className="text-center py-20"
            data-ocid="admin.products.empty_state"
          >
            <p className="font-display text-xl text-muted-foreground mb-4">
              No products yet
            </p>
            <Button
              onClick={openCreate}
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10"
              data-ocid="admin.add_first_product.button"
            >
              <Plus className="mr-2 w-4 h-4" /> Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {(products ?? []).map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-xl"
                data-ocid={`admin.product.item.${idx + 1}`}
              >
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={
                      product.imageId ||
                      `https://picsum.photos/seed/${product.id}/100/125`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-sm">
                      {product.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] tracking-widest uppercase text-primary border-primary/30"
                    >
                      {product.category}
                    </Badge>
                    {product.featured && (
                      <Badge className="text-[10px] bg-primary/20 text-primary border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(product.price)} · Stock:{" "}
                    {product.stock.toString()}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(product)}
                    className="h-8 w-8 p-0 border-border/60 hover:border-primary/50"
                    data-ocid={`admin.product.edit_button.${idx + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteTarget(product.id)}
                    className="h-8 w-8 p-0 border-border/60 hover:border-destructive/50 hover:text-destructive"
                    data-ocid={`admin.product.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg bg-card border-border/60 max-h-[90vh] overflow-y-auto"
          data-ocid="admin.product.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">
                Product Image
              </Label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-border/60"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center h-32 border border-dashed border-border/60 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all"
                    data-ocid="admin.image.dropzone"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      data-ocid="admin.image.upload_button"
                    />
                  </label>
                )}
                {uploading && (
                  <div
                    className="mt-2 space-y-1"
                    data-ocid="admin.upload.loading_state"
                  >
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-muted-foreground text-center">
                      Uploading {progress}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs uppercase tracking-wider"
              >
                Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Oud Noir Intense"
                className="bg-muted/30 border-border/60"
                data-ocid="admin.product.name.input"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  className="bg-muted/30 border-border/60"
                  data-ocid="admin.product.category.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/60">
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="desc"
                className="text-xs uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the fragrance..."
                rows={3}
                className="bg-muted/30 border-border/60 resize-none"
                data-ocid="admin.product.description.textarea"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-xs uppercase tracking-wider"
                >
                  Price (paise)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price.toString()}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: BigInt(e.target.value || "0"),
                    }))
                  }
                  placeholder="e.g. 350000"
                  className="bg-muted/30 border-border/60"
                  data-ocid="admin.product.price.input"
                />
                {form.price > BigInt(0) && (
                  <p className="text-[11px] text-muted-foreground">
                    {formatPrice(form.price)}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="stock"
                  className="text-xs uppercase tracking-wider"
                >
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={form.stock.toString()}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stock: BigInt(e.target.value || "0"),
                    }))
                  }
                  placeholder="e.g. 50"
                  className="bg-muted/30 border-border/60"
                  data-ocid="admin.product.stock.input"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Sizes (comma separated)
              </Label>
              <Input
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="e.g. 30ml, 50ml, 100ml"
                className="bg-muted/30 border-border/60"
                data-ocid="admin.product.sizes.input"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider">
                Featured Product
              </Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                data-ocid="admin.product.featured.switch"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border/60"
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="btn-gold"
              data-ocid="admin.product.save_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 w-4 h-4" />{" "}
                  {editingProduct ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border/60"
          data-ocid="admin.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border/60"
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.delete.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
