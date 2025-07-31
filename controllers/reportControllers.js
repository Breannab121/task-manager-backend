import Task from "../models/Task.js";
import User from "../models/User.js";
import excelJS from "exceljs";

//@desc EXport all tasks as an Excel file
//@route GET /api/reports/export/tasks
//@access Private (Admin)
export const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ")
        : task.assignedTo?.name
        ? `${task.assignedTo.name} (${task.assignedTo.email})`
        : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "N/A",
        assignedTo,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting tasks", error: error.message });
  }
};


//@desc EXport all tasks as an Excel file
//@route GET /api/reports/export/tasks
//@access Private (Admin)
export const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email _id");

    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      const assignedUsers = Array.isArray(task.assignedTo)
        ? task.assignedTo
        : [task.assignedTo];

      assignedUsers.forEach((assignedUser) => {
        const uid = assignedUser?._id?.toString();
        if (uid && userTaskMap[uid]) {
          userTaskMap[uid].taskCount += 1;

          if (task.status === "Pending") {
            userTaskMap[uid].pendingTasks += 1;
          } else if (task.status === "In Progress") {
            userTaskMap[uid].inProgressTasks += 1;
          } else if (task.status === "Completed") {
            userTaskMap[uid].completedTasks += 1;
          }
        }
      });
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users_report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error exporting users report", error: error.message });
  }
};


