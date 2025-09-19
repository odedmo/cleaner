import { useState, useEffect, useCallback } from "react";
import { Layout } from "./components/Layout";
import { MonthlyOverview } from "./components/MonthlyOverview";
import { Summary } from "./components/Summary";
import { EditModal } from "./components/EditModal";
import { supabase } from "./lib/supabase";
import type { DbHistoryRecord } from "./lib/supabase";

type HistoryRecord = {
  id: string;
  year: number;
  month: number;
  visits: number;
  employerContribution: number;
  employeeContribution: number;
  dateAdded: string;
};

function App() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [enabledMonths, setEnabledMonths] = useState<Set<number>>(new Set());

  const fetchHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("year", selectedYear)
      .order("date_added", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
      return;
    }

    setHistory(
      data.map((record: DbHistoryRecord) => ({
        id: record.id,
        year: record.year,
        month: record.month,
        visits: record.visits,
        employerContribution: record.employer_contribution,
        employeeContribution: record.employee_contribution,
        dateAdded: record.date_added,
      }))
    );
  }, [selectedYear]);

  useEffect(() => {
    fetchHistory();
  }, [selectedYear, fetchHistory]);

  const BASE_PAYMENT = 260;
  const PENSION_RATE = 0.125;
  const BENEFITS_RATE = 0.06;
  const CLEANER_RATE = BENEFITS_RATE; // 6% is the cleaner's share

  const calculateMonthlyPension = (visitsCount: number) => {
    const totalPerVisit = BASE_PAYMENT * (PENSION_RATE + BENEFITS_RATE);
    return totalPerVisit * visitsCount;
  };

  const calculateCleanerShare = (visitsCount: number) => {
    const sharePerVisit = BASE_PAYMENT * CLEANER_RATE;
    return sharePerVisit * visitsCount;
  };

  const handleSave = async (month: number, visits: number) => {
    const employerContribution = calculateMonthlyPension(visits);
    const employeeContribution = calculateCleanerShare(visits);

    // Find existing record for this month and year
    const { data: existingRecords } = await supabase
      .from("history")
      .select("*")
      .eq("year", selectedYear)
      .eq("month", month);

    const newRecord = {
      year: selectedYear,
      month,
      visits,
      employer_contribution: employerContribution,
      employee_contribution: employeeContribution,
      date_added: new Date().toISOString(),
    };

    let error;

    if (existingRecords && existingRecords.length > 0) {
      // Update the existing record
      const { error: updateError } = await supabase
        .from("history")
        .update(newRecord)
        .eq("id", existingRecords[0].id);

      error = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("history").insert({
        ...newRecord,
        id: crypto.randomUUID(),
      });

      error = insertError;
    }

    if (error) {
      console.error("Error saving record:", error);
      return;
    }

    await fetchHistory();
  };

  const getMonthVisits = (month: number): number => {
    const record = history
      .filter((r) => r.year === selectedYear && r.month === month)
      .sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )[0];
    return record?.visits || 0;
  };

  const getYearData = () => {
    const data = new Array(12).fill(null).map((_, month) => {
      const record = history
        .filter((r) => r.year === selectedYear && r.month === month)
        .sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        )[0];

      return {
        visits: record?.visits || 0,
        employer: record?.employerContribution || 0,
        employee: record?.employeeContribution || 0,
      };
    });

    return data;
  };

  const yearData = getYearData();
  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
    setEditModalOpen(true);
  };

  return (
    <Layout title="Cleaner Pension Calculator">
      <MonthlyOverview
        year={selectedYear}
        onYearChange={setSelectedYear}
        enabledMonths={enabledMonths}
        onEnabledMonthsChange={setEnabledMonths}
        contributions={yearData}
        onEditMonth={handleEditMonth}
      />
      <Summary
        year={selectedYear}
        enabledMonths={enabledMonths}
        contributions={yearData}
      />
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        month={editingMonth || 0}
        currentVisits={editingMonth !== null ? getMonthVisits(editingMonth) : 0}
        onSave={(visits) => {
          if (editingMonth !== null) {
            handleSave(editingMonth, visits);
          }
        }}
      />
    </Layout>
  );
}

export default App;
