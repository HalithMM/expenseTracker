import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogContentText,
  Autocomplete,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  HorizontalRule as HorizontalRuleIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import moment from "moment";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

// Mock database functions
const mockDB = {
  expenses: [],
  budgets: {},
  
  getExpenses: function() {
    return Promise.resolve(this.expenses);
  },
  
  addExpense: function(expense) {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.expenses.push(newExpense);
    return Promise.resolve(newExpense);
  },
  
  updateExpense: function(id, updates) {
    const index = this.expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
      this.expenses[index] = {
        ...this.expenses[index],
        ...updates,
        updatedAt: new Date()
      };
      return Promise.resolve(this.expenses[index]);
    }
    return Promise.reject("Expense not found");
  },
  
  deleteExpense: function(id) {
    this.expenses = this.expenses.filter(exp => exp.id !== id);
    return Promise.resolve();
  },
  
  getBudgets: function() {
    return Promise.resolve(this.budgets);
  },
  
  saveBudget: function(year, month, amounts) {
    const key = `${year}-${month}`;
    this.budgets[key] = amounts;
    return Promise.resolve();
  },
  
  deleteBudget: function(key) {
    delete this.budgets[key];
    return Promise.resolve();
  }
};

// Office Expense Types and Subtypes
const expenseTypes = {
  "Office Supplies": [
    "Stationery",
    "Printing",
    "Pens & Markers",
    "Notepads",
    "Staples & Clips",
  ],
  Technology: [
    "Computers",
    "Software",
    "Printers",
    "Servers",
    "Networking",
    "Peripherals",
  ],
  Furniture: [
    "Desks",
    "Chairs",
    "Storage",
    "Conference Tables",
    "Reception Furniture",
  ],
  Utilities: ["Electricity", "Water", "Internet", "Phone", "Heating/Cooling"],
  Maintenance: [
    "Cleaning",
    "Repairs",
    "Janitorial",
    "Pest Control",
    "Landscaping",
  ],
  Rent: ["Office Space", "Parking", "Storage Units", "Equipment Rental"],
  Travel: ["Flights", "Hotels", "Meals", "Transportation", "Conferences"],
  Marketing: [
    "Advertising",
    "Print Materials",
    "Digital Ads",
    "Promotional Items",
  ],
  "Professional Services": ["Legal", "Accounting", "Consulting", "IT Support"],
  "Employee Expenses": [
    "Training",
    "Team Lunches",
    "Recognition",
    "Health & Wellness",
  ],
  Insurance: ["Property", "Liability", "Health", "Workers Comp"],
  Taxes: ["Property Tax", "Sales Tax", "Payroll Tax", "Business Tax"],
  Communication: ["Postage", "Courier", "Broadband", "Mobile Plans"],
  Security: [
    "Alarm Systems",
    "Surveillance",
    "Security Personnel",
    "Cybersecurity",
  ],
  Miscellaneous: ["Bank Fees", "Office Plants", "Coffee/Water", "Donations"],
};

// Budget Form Component
const BudgetForm = ({ open, onClose, onSubmit, expenseTypes, initialData }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    amounts: {},
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    } else if (open) {
      const initialAmounts = {};
      Object.keys(expenseTypes).forEach((type) => {
        initialAmounts[type] = 0;
      });
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        amounts: initialAmounts,
      });
    }
  }, [open, initialData, expenseTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      amounts: {
        ...prev.amounts,
        [type]: value ? parseFloat(value) : 0,
      },
    }));
  };

  const calculateTotal = () => {
    return Object.values(formData.amounts)
      .reduce((sum, val) => sum + (val || 0), 0)
      .toFixed(2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Office Budget" : "Create New Office Budget"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
                label="Year"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() + i - 2
                ).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={formData.month}
                onChange={handleChange}
                label="Month"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month}>
                    {new Date(2000, month - 1, 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Office Budget Categories
            </Typography>
          </Grid>

          {Object.keys(expenseTypes).map((type) => (
            <Grid item xs={12} sm={6} key={type}>
              <TextField
                label={`${type} Budget`}
                type="number"
                fullWidth
                value={formData.amounts[type] || ""}
                onChange={(e) => handleAmountChange(type, e.target.value)}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="h6">
              Total Office Budget: ₹{calculateTotal()}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onSubmit(formData)}
          color="primary"
          variant="contained"
        >
          {initialData ? "Update Budget" : "Create Budget"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Expense Form Component with mandatory subcategory
const ExpenseForm = ({
  open,
  onClose,
  onSubmit,
  expenseTypes,
  formData,
  setFormData,
  isEditMode,
}) => {
  // Create a flattened list of all subcategories with their parent categories
  const allSubcategories = Object.entries(expenseTypes).flatMap(
    ([type, subtypes]) =>
      subtypes.map((subtype) => ({
        label: subtype,
        category: type,
      }))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit Office Expense" : "Add New Office Expense"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Expense Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Expense Date"
              type="date"
              value={format(new Date(formData.date), "yyyy-MM-dd")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: new Date(e.target.value),
                }))
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={allSubcategories}
              getOptionLabel={(option) =>
                `${option.label} (${option.category})`
              }
              value={
                formData.subtype
                  ? allSubcategories.find(
                      (sc) => sc.label === formData.subtype
                    ) || null
                  : null
              }
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  subtype: newValue?.label || "",
                  type: newValue?.category || "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Expense Subcategory *"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="type"
              label="Category (auto-filled)"
              value={formData.type}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="vendor"
              label="Vendor/Supplier"
              value={formData.vendor || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Additional Notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onSubmit()}
          color="primary"
          variant="contained"
          disabled={!formData.subtype}
        >
          {isEditMode ? "Update Expense" : "Add Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Expense Tracker Component
export default function OfficeExpenseTracker() {
  // State
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    description: "",
    amount: "",
    date: new Date(),
    type: "",
    subtype: "",
    vendor: "",
    notes: "",
    enteredBy: "Office Admin",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [tempBudget, setTempBudget] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: moment().startOf("month").startOf("day"),
    end: moment().endOf("month").endOf("day"),
  });
  const [focusedInput, setFocusedInput] = useState(null);
  const [showBudgetTable, setShowBudgetTable] = useState(false);
  const [budgetDetails, setBudgetDetails] = useState(null);
  const [deleteBudgetDialogOpen, setDeleteBudgetDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [branch, setBranch] = useState("");

  // Calculate number of days selected and days in month
  const numDaysSelected = dateRange.end.diff(dateRange.start, "days") + 1;
  const daysInMonth = selectedBudget
    ? moment(
        `${selectedBudget.split("-")[0]}-${selectedBudget.split("-")[1]}`,
        "YYYY-MM"
      ).daysInMonth()
    : 30;

  // Load expenses from mock database
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const expensesData = await mockDB.getExpenses();
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    };

    loadExpenses();
  }, []);

  // Load budgets from mock database
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const budgetsData = await mockDB.getBudgets();
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error loading budgets:", error);
      }
    };

    loadBudgets();
  }, []);

  // Auto-select current month's budget if it exists
  useEffect(() => {
    if (Object.keys(budgets).length > 0 && !selectedBudget) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentBudgetKey = `${currentYear}-${currentMonth}`;

      if (budgets[currentBudgetKey]) {
        setSelectedBudget(currentBudgetKey);
        setDateRange({
          start: moment().startOf("month").startOf("day"),
          end: moment().endOf("month").endOf("day"),
        });
      }
    }
  }, [budgets, selectedBudget]);

  // Filter expenses based on date range and filters
  useEffect(() => {
    if (!dateRange.start || !dateRange.end) return;

    const filtered = expenses.filter((exp) => {
      const expDate = moment(exp.date).startOf("day");
      const dateInRange =
        expDate.isSameOrAfter(dateRange.start.startOf("day")) &&
        expDate.isSameOrBefore(dateRange.end.startOf("day"));

      const categoryMatch = !categoryFilter || exp.type === categoryFilter;
      const subcategoryMatch =
        !subcategoryFilter || exp.subtype === subcategoryFilter;
      const branchMatch = !branch || exp.branch === branch;

      return dateInRange && categoryMatch && subcategoryMatch && branchMatch;
    });

    setFilteredExpenses(filtered);
  }, [dateRange, expenses, categoryFilter, subcategoryFilter, branch]);

  // Get budget period options for dropdown
  const getBudgetOptions = () => {
    return Object.keys(budgets).map((key) => {
      const [year, month] = key.split("-");
      return {
        value: key,
        label: `${new Date(year, month - 1, 1).toLocaleString("default", {
          month: "long",
        })} ${year}`,
        year: parseInt(year),
        month: parseInt(month),
      };
    });
  };

  // Get current budget data
  const getCurrentBudget = () => {
    if (!selectedBudget) return { amounts: {}, total: 0 };

    const budgetData = budgets[selectedBudget] || {};
    // Ensure all categories are included, even if not in database
    const completeAmounts = {};
    Object.keys(expenseTypes).forEach((type) => {
      completeAmounts[type] = budgetData[type] || 0;
    });

    return {
      amounts: completeAmounts,
      total: Object.values(completeAmounts).reduce(
        (sum, val) => sum + (val || 0),
        0
      ),
    };
  };

  const currentBudget = getCurrentBudget();

  // Handle budget selection
  const handleBudgetChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setSelectedBudget(null);
      return;
    }

    setSelectedBudget(value);
    const [year, month] = value.split("-");
    setDateRange({
      start: moment()
        .year(year)
        .month(month - 1)
        .startOf("month")
        .startOf("day"),
      end: moment()
        .year(year)
        .month(month - 1)
        .endOf("month")
        .endOf("day"),
    });
  };

  // Handle date range change
  const handleDatesChange = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      setDateRange({
        start: startDate.startOf("day"),
        end: endDate.startOf("day"),
      });
    }
  };

  // Handle budget submission to database
  const handleBudgetSubmit = async (formData) => {
    const { year, month, amounts } = formData;

    if (!year || !month) {
      console.error("Invalid budget data");
      return;
    }

    const key = `${year}-${month}`;

    try {
      await mockDB.saveBudget(year, month, amounts);
      setBudgets(prev => ({ ...prev, [key]: amounts }));
      setShowBudgetForm(false);
      setSelectedBudget(key);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  // Handle delete budget from database
  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;

    try {
      await mockDB.deleteBudget(budgetToDelete);
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[budgetToDelete];
        return newBudgets;
      });
      
      if (selectedBudget === budgetToDelete) {
        setSelectedBudget(null);
      }
      setBudgetToDelete(null);
      setDeleteBudgetDialogOpen(false);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  // Handle view budget details
  const handleViewBudgetDetails = (budgetKey) => {
    const [year, month] = budgetKey.split("-");
    setBudgetDetails({
      year: parseInt(year),
      month: parseInt(month),
      amounts: budgets[budgetKey],
    });
  };

  // Handle edit budget from table
  const handleEditBudgetFromTable = (budgetKey) => {
    const [year, month] = budgetKey.split("-");
    setTempBudget({
      year: parseInt(year),
      month: parseInt(month),
      amounts: budgets[budgetKey],
    });
    setShowBudgetForm(true);
  };

  // Handle delete budget from table
  const handleDeleteBudgetFromTable = (budgetKey) => {
    setBudgetToDelete(budgetKey);
    setDeleteBudgetDialogOpen(true);
  };

  const getChartData = () => {
    if (filteredExpenses.length === 0) return [];

    const previousStart = moment(dateRange.start).subtract(1, "month");
    const previousEnd = moment(dateRange.start).subtract(1, "month");

    const currentData = {};
    const previousData = {};

    filteredExpenses.forEach((exp) => {
      currentData[exp.type] = (currentData[exp.type] || 0) + exp.amount;
    });

    expenses.forEach((exp) => {
      const expDate = moment(exp.date).startOf("day");
      if (
        expDate.isSameOrAfter(previousStart.startOf("day")) &&
        expDate.isSameOrBefore(previousEnd.startOf("day"))
      ) {
        previousData[exp.type] = (previousData[exp.type] || 0) + exp.amount;
      }
    });

    const allCategories = new Set([
      ...Object.keys(currentData),
      ...Object.keys(previousData),
    ]);

    return Array.from(allCategories)
      .map((category) => {
        const budgetAmount = currentBudget.amounts[category] || 0;
        const proportionalBudget =
          (budgetAmount / daysInMonth) * numDaysSelected;

        return {
          name: category,
          CurrentValue: currentData[category] || 0,
          PreviousValue: previousData[category] || 0,
          ProportionalBudget: proportionalBudget,
          type: category,
          subtype: "General",
        };
      })
      .filter((t) => (categoryFilter ? t.type == categoryFilter : true));
  };

  const chartData = getChartData();

  // Calculate trends
  const calculateTrends = () => {
    if (filteredExpenses.length === 0)
      return {
        currentPeriodTotal: 0,
        previousPeriodTotal: 0,
        percentageChange: 0,
      };

    const currentTotal = filteredExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Calculate previous period total
    const previousStart = moment(dateRange.start).subtract(1, "month");
    const previousEnd = moment(dateRange.start).subtract(1, "month");

    const previousTotal = expenses
      .filter((t) => (categoryFilter ? t.type == categoryFilter : true))
      .filter((exp) => {
        const expDate = moment(exp.date).startOf("day");
        return (
          expDate.isSameOrAfter(previousStart.startOf("day")) &&
          expDate.isSameOrBefore(previousEnd.startOf("day"))
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const percentageChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : currentTotal > 0
          ? 100
          : 0;

    return {
      currentPeriodTotal: currentTotal,
      previousPeriodTotal: previousTotal,
      percentageChange,
    };
  };

  const trendData = calculateTrends();

  const getTrendIcon = (direction) => {
    switch (direction) {
      case "up":
        return <ArrowUpwardIcon color="error" />;
      case "down":
        return <ArrowDownwardIcon color="success" />;
      default:
        return <HorizontalRuleIcon color="action" />;
    }
  };

  // Handle add/edit expense
  const handleSubmitExpense = async () => {
    try {
      if (
        !formData.description ||
        !formData.amount ||
        !formData.type ||
        !formData.subtype
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        subtype: formData.subtype,
        vendor: formData.vendor || null,
        notes: formData.notes || null,
        enteredBy: "Office Admin",
        branch: branch || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (isEditMode) {
        await mockDB.updateExpense(formData.id, expenseData);
      } else {
        await mockDB.addExpense(expenseData);
      }

      // Refresh expenses
      const expensesData = await mockDB.getExpenses();
      setExpenses(expensesData);
      
      resetForm();
      setExpenseFormOpen(false);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      description: "",
      amount: "",
      date: new Date(),
      type: "",
      subtype: "",
      vendor: "",
      notes: "",
      enteredBy: "Office Admin",
    });
    setIsEditMode(false);
  };

  // Handle edit expense
  const handleEditExpense = (expense) => {
    setFormData({
      id: expense.id,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      type: expense.type,
      subtype: expense.subtype || "",
      vendor: expense.vendor || "",
      notes: expense.notes || "",
    });
    setIsEditMode(true);
    setExpenseFormOpen(true);
  };

  // Handle delete expense
  const handleDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  // Confirm delete expense
  const confirmDelete = async () => {
    try {
      if (!expenseToDelete) return;

      await mockDB.deleteExpense(expenseToDelete.id);
      
      // Refresh expenses
      const expensesData = await mockDB.getExpenses();
      setExpenses(expensesData);
      
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Cancel delete expense
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Cancel delete budget
  const cancelDeleteBudget = () => {
    setDeleteBudgetDialogOpen(false);
    setBudgetToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Office Expense Tracker
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setExpenseFormOpen(true);
          }}
          sx={{ ml: 2 }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Expense Form Dialog */}
      <ExpenseForm
        open={expenseFormOpen}
        onClose={() => {
          setExpenseFormOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmitExpense}
        expenseTypes={expenseTypes}
        formData={formData}
        setFormData={setFormData}
        isEditMode={isEditMode}
      />

      {/* Budget Table Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Office Budgets</Typography>
          <Button
            variant="outlined"
            onClick={() => setShowBudgetTable(!showBudgetTable)}
            startIcon={<CalendarIcon />}
            size="small"
          >
            {showBudgetTable ? "Hide" : "View All"}
          </Button>
        </Box>
        {showBudgetTable && (
          <Box mt={2}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Total Budget</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(budgets).map((key) => {
                    const [year, month] = key.split("-");
                    const monthName = new Date(
                      year,
                      month - 1,
                      1
                    ).toLocaleString("default", { month: "long" });
                    const total = Object.values(budgets[key]).reduce(
                      (sum, val) => sum + (val || 0),
                      0
                    );

                    return (
                      <TableRow key={key} hover>
                        <TableCell>{`${monthName} ${year}`}</TableCell>
                        <TableCell>₹{total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {Object.keys(expenseTypes).map(
                              (type) =>
                                budgets[key][type] > 0 && (
                                  <Chip
                                    key={type}
                                    label={`${type}: ₹${budgets[key][
                                      type
                                    ].toFixed(2)}`}
                                    size="small"
                                  />
                                )
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleViewBudgetDetails(key)}
                            title="View Details"
                            size="small"
                          >
                            <VisibilityIcon color="primary" fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditBudgetFromTable(key)}
                            title="Edit"
                            size="small"
                          >
                            <EditIcon color="primary" fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteBudgetFromTable(key)}
                            title="Delete"
                            size="small"
                          >
                            <DeleteIcon color="error" fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setTempBudget(null);
              setShowBudgetForm(true);
            }}
            startIcon={<AddIcon />}
          >
            Create New Budget
          </Button>
        </Box>
      </Paper>

      {/* Budget Selection */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Budget Month</InputLabel>
              <Select
                value={selectedBudget || ""}
                onChange={handleBudgetChange}
                label="Select Budget Month"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {getBudgetOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Branch</InputLabel>
              <Select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                label="Select Branch"
              >
                <MenuItem value="">All Branches</MenuItem>
                <MenuItem value="BranchA">Branch A</MenuItem>
                <MenuItem value="BranchB">Branch B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {selectedBudget && (
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Box>
                  <Typography variant="subtitle2">Full Month Budget</Typography>
                  <Typography variant="h6">
                    ₹{currentBudget.total.toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">
                    Proportional Budget
                  </Typography>
                  <Typography variant="h6">
                    ₹
                    {(
                      (currentBudget.total / daysInMonth) *
                      numDaysSelected
                    ).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Date Range Picker */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Date Range
        </Typography>
        <DateRangePicker
          startDate={dateRange.start}
          startDateId="start_date"
          endDate={dateRange.end}
          endDateId="end_date"
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          isOutsideRange={() => false}
          minimumNights={0}
          displayFormat="MMM D, YYYY"
        />
        {selectedBudget && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            ({numDaysSelected} days selected of {daysInMonth} in month)
          </Typography>
        )}
      </Paper>

      {/* Expense Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubcategoryFilter("");
                }}
                label="Filter by Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {Object.keys(expenseTypes).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Subcategory</InputLabel>
              <Select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                label="Filter by Subcategory"
                disabled={!categoryFilter}
              >
                <MenuItem value="">All Subcategories</MenuItem>
                {categoryFilter &&
                  expenseTypes[categoryFilter]?.map((subtype) => (
                    <MenuItem key={subtype} value={subtype}>
                      {subtype}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Budget vs. Spending Analysis */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">
            Budget vs. Spending
            {selectedBudget && (
              <Typography variant="subtitle2" color="text.secondary">
                {format(dateRange.start.toDate(), "MMM d")} -{" "}
                {format(dateRange.end.toDate(), "MMM d, yyyy")}
              </Typography>
            )}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1">Current Period</Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
              {trendData.currentPeriodTotal.toFixed(2)}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {trendData.percentageChange >= 0 ? "+" : ""}
                  {trendData.percentageChange.toFixed(1)}% from previous
                </Typography>
                {trendData.percentageChange > 0
                  ? getTrendIcon("up")
                  : trendData.percentageChange < 0
                  ? getTrendIcon("down")
                  : getTrendIcon("same")}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="CurrentValue" fill="#8884d8" name="Current" />
                <Bar
                  dataKey="ProportionalBudget"
                  fill="#82ca9d"
                  name="Budget (proportional)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Expense Breakdown by Category */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Expense Breakdown by Category
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="CurrentValue"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    [
                      "#0088FE",
                      "#00C49F",
                      "#FFBB28",
                      "#FF8042",
                      "#8884d8",
                      "#82ca9d",
                    ][index % 6]
                  }
                />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value, name, props) => [
                `₹${value.toFixed(2)}`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      {/* Expense List */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Office Expenses</Typography>
          <Typography variant="subtitle1">
            Total: ₹{filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No expenses found for the selected period
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                    <TableCell>{expense.subtype}</TableCell>
                    <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.vendor || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEditExpense(expense)}
                        size="small"
                      >
                        <EditIcon color="primary" fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteExpense(expense)}
                        size="small"
                      >
                        <DeleteIcon color="error" fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Budget Form Dialog */}
      <BudgetForm
        open={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        onSubmit={handleBudgetSubmit}
        expenseTypes={expenseTypes}
        initialData={tempBudget}
      />

      {/* Delete Expense Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Budget Confirmation Dialog */}
      <Dialog
        open={deleteBudgetDialogOpen}
        onClose={cancelDeleteBudget}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteBudget}>Cancel</Button>
          <Button
            onClick={handleDeleteBudget}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Budget Details Dialog */}
      <Dialog
        open={budgetDetails !== null}
        onClose={() => setBudgetDetails(null)}
        maxWidth="md"
        fullWidth
      >
        {budgetDetails && (
          <>
            <DialogTitle>
              Budget Details for{" "}
              {new Date(
                budgetDetails.year,
                budgetDetails.month - 1,
                1
              ).toLocaleString("default", { month: "long" })}{" "}
              {budgetDetails.year}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Budget Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(budgetDetails.amounts).map((category) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell align="right">
                          ₹{budgetDetails.amounts[category].toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>
                          ₹
                          {Object.values(budgetDetails.amounts)
                            .reduce((sum, val) => sum + val, 0)
                            .toFixed(2)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBudgetDetails(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}