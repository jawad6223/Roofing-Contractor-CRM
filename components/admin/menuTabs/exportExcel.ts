import * as ExcelJS from "exceljs";
import { LeadType } from "@/types/AdminTypes";

export const exportToExcel = async (filteredLeads: LeadType[]) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Leads");

      // Add headers
      worksheet.columns = [
        { header: "First Name", key: "firstName", width: 15 },
        { header: "Last Name", key: "lastName", width: 15 },
        { header: "Phone Number", key: "phoneno", width: 15 },
        { header: "Email", key: "email", width: 25 },
        { header: "Zip Code", key: "zipCode", width: 10 },
        { header: "Insurance Company", key: "company", width: 20 },
        { header: "Policy Number", key: "policy", width: 15 },
        { header: "Assigned To", key: "assignedTo", width: 20 },
      ];

      // Add data rows
      filteredLeads.forEach((lead) => {
        worksheet.addRow({
          firstName: lead["First Name"],
          lastName: lead["Last Name"],
          phoneno: lead["Phone Number"],
          email: lead["Email Address"],
          zipCode: lead["Property ZIP Code"],
          company: lead["Insurance Company"],
          policy: lead["Policy Number"],
          assignedTo: lead["Assigned To"] || "Unassigned",
        });
      });

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `leads_export_${currentDate}.xlsx`;

      // Download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log(`Excel file "${filename}" downloaded successfully!`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting data to Excel. Please try again.");
    }
  };