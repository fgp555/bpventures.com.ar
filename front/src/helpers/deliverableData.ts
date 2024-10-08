const deliverableMock = [
  {
    id: 1,
    parentId: null, // No tiene parentId, es la raíz
    deliverableName: "Folder A",
    deliverableIsFolder: true,
    deliverablePath: "folder_a",
    deliverableType: "Folder",
    deliverableCategory: "Formularios",
    permissionTypes: ["owner", "view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 2,
    parentId: null, // No tiene parentId, es la raíz
    deliverableName: "Folder B",
    deliverableIsFolder: true,
    deliverablePath: "folder_b",
    deliverableType: "Folder",
    deliverableCategory: "Proyectos",
    permissionTypes: ["owner", "view"],
    lastDate: "01-09-2024",
  },
  {
    id: 3,
    parentId: 2,
    deliverableName: "Folder C",
    deliverableIsFolder: true,
    deliverablePath: "folder_c",
    deliverableType: "Folder",
    deliverableCategory: "Recursos",
    permissionTypes: ["view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 4,
    parentId: 1,
    deliverableName: "Budget Report",
    deliverableIsFolder: false,
    deliverablePath: "folder_a/budget_report.xls",
    deliverableType: "xls",
    deliverableCategory: "Finanzas",
    permissionTypes: ["view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 5,
    parentId: 2,
    deliverableName: "Project Plan",
    deliverableIsFolder: false,
    deliverablePath: "folder_b/project_plan.xls",
    deliverableType: "xls",
    deliverableCategory: "Proyectos",
    permissionTypes: ["owner", "view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 6,
    parentId: 3,
    deliverableName: "Resource Allocation",
    deliverableIsFolder: false,
    deliverablePath: "folder_c/resource_allocation.xls",
    deliverableType: "xls",
    deliverableCategory: "Recursos",
    permissionTypes: ["view"],
    lastDate: "01-09-2024",
  },
  {
    id: 7,
    parentId: 2,
    deliverableName: "Meeting Notes",
    deliverableIsFolder: false,
    deliverablePath: "folder_b/meeting_notes.doc",
    deliverableType: "doc",
    deliverableCategory: "Documentos",
    permissionTypes: ["view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 8,
    parentId: 1,
    deliverableName: "Strategy Document",
    deliverableIsFolder: false,
    deliverablePath: "folder_a/strategy_document.doc",
    deliverableType: "doc",
    deliverableCategory: "Estrategia",
    permissionTypes: ["owner", "view"],
    lastDate: "01-09-2024",
  },
  {
    id: 9,
    parentId: 3,
    deliverableName: "Product Overview",
    deliverableIsFolder: false,
    deliverablePath: "folder_c/product_overview.pdf",
    deliverableType: "pdf",
    deliverableCategory: "Productos",
    permissionTypes: ["view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 10,
    parentId: 1,
    deliverableName: "Market Analysis",
    deliverableIsFolder: false,
    deliverablePath: "folder_a/market_analysis.pdf",
    deliverableType: "pdf",
    deliverableCategory: "Mercado",
    permissionTypes: ["owner", "view", "edit"],
    lastDate: "01-09-2024",
  },
  {
    id: 11,
    parentId: 2,
    deliverableName: "Compliance Checklist",
    deliverableIsFolder: false,
    deliverablePath: "folder_b/compliance_checklist.pdf",
    deliverableType: "pdf",
    deliverableCategory: "Legal",
    permissionTypes: ["owner"],
    lastDate: "01-09-2024",
  },
  {
    id: 12,
    parentId: 3,
    deliverableName: "User Manual",
    deliverableIsFolder: false,
    deliverablePath: "folder_c/user_manual.pdf",
    deliverableType: "jpg",
    deliverableCategory: "Documentación",
    permissionTypes: ["view"],
    lastDate: "01-09-2024",
  },
];

export default deliverableMock;
