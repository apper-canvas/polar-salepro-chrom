class InvoiceService {
  constructor() {
    this.tableName = 'invoice_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_date_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_date_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(invoiceData) {
    try {
      // Generate invoice number
      const timestamp = Date.now();
      const invoiceNumber = `INV-2024-${String(timestamp).slice(-6)}`;
      
      const params = {
        records: [{
          Name: invoiceNumber,
          invoice_number_c: invoiceNumber,
          contact_id_c: parseInt(invoiceData.contactId),
          deal_id_c: invoiceData.dealId ? parseInt(invoiceData.dealId) : null,
          issue_date_c: new Date().toISOString(),
          due_date_c: invoiceData.dueDate,
          line_items_c: JSON.stringify(invoiceData.lineItems || []),
          subtotal_c: parseFloat(invoiceData.subtotal) || 0,
          tax_amount_c: parseFloat(invoiceData.taxAmount) || 0,
          total_amount_c: parseFloat(invoiceData.totalAmount) || 0,
          status_c: invoiceData.status || "Draft"
        }]
      };

      // Remove null fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === null) {
          delete params.records[0][key];
        }
      });
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} invoices:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating invoice:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = {
        Id: parseInt(id)
      };

      // Map fields to database schema
      if (updateData.invoiceNumber) updateRecord.invoice_number_c = updateData.invoiceNumber;
      if (updateData.invoiceNumber) updateRecord.Name = updateData.invoiceNumber;
      if (updateData.contactId) updateRecord.contact_id_c = parseInt(updateData.contactId);
      if (updateData.dealId) updateRecord.deal_id_c = parseInt(updateData.dealId);
      if (updateData.issueDate) updateRecord.issue_date_c = updateData.issueDate;
      if (updateData.dueDate) updateRecord.due_date_c = updateData.dueDate;
      if (updateData.lineItems !== undefined) updateRecord.line_items_c = JSON.stringify(updateData.lineItems);
      if (updateData.subtotal !== undefined) updateRecord.subtotal_c = parseFloat(updateData.subtotal) || 0;
      if (updateData.taxAmount !== undefined) updateRecord.tax_amount_c = parseFloat(updateData.taxAmount) || 0;
      if (updateData.totalAmount !== undefined) updateRecord.total_amount_c = parseFloat(updateData.totalAmount) || 0;
      if (updateData.status) updateRecord.status_c = updateData.status;
      if (updateData.paymentDate) updateRecord.payment_date_c = updateData.paymentDate;

      const params = {
        records: [updateRecord]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} invoices:`, JSON.stringify(failed));
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating invoice:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} invoices:`, JSON.stringify(failed));
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting invoice:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_date_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "ExactMatch", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByContact(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "invoice_number_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "issue_date_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "line_items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_date_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "ExactMatch", "Values": [parseInt(contactId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching invoices by contact:", error?.response?.data?.message || error);
      return [];
    }
  }
}
export default new InvoiceService();