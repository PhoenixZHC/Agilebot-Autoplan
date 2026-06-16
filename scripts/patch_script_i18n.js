const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'static', 'script.js');
let s = fs.readFileSync(filePath, 'utf8');

const replacements = [
  [/translateServerMessage\(data\.error\) \|\| data\.error/g, 'resolveApiError(data)'],
  [/translateServerMessage\(data\.message\) \|\| data\.message/g, 'resolveApiMessage(data)'],
  [/translateServerMessage\(error\.message\) \|\| error\.message/g, 'formatAppError(error)'],
  [/throw new Error\(data\.error\)/g, 'throwApiError(data)'],
  [/throw new Error\(err\.error \|\| '[^']+'\)/g, "throwApiError(err, 'error_request_failed')"],
  [/throw new Error\('读取PR寄存器失败'\)/g, "throw appError('error_read_pr_failed')"],
  [/throw new Error\(`机器人当前状态: \$\{data\.status\}，无法自动写入`\)/g, "throw appError('error_robot_status_cannot_auto_write', { status: data.status })"],
  [/throw new Error\(`当前有程序在运行: \$\{data\.running_programs\.join\(', '\)\}，无法自动写入`\)/g, "throw appError('error_program_running_cannot_auto_write', { programs: data.running_programs.join(', ') })"],
  [/throw new Error\('请输入程序名称'\)/g, "throw appError('error_enter_program_name')"],
  [/throw new Error\('请输入有效的PR寄存器ID'\)/g, "throw appError('error_invalid_pr_register_id')"],
  [/throw new Error\('没有可用的数据'\)/g, "throw appError('error_no_data_available')"],
  [/throw new Error\(`第 \$\{index \+ 1\} 行数据清单坐标无效`\)/g, "throw appError('error_data_list_row_invalid', { row: index + 1 })"],
  [/throw new Error\('请先进行计算并确保工具数量已选择'\)/g, "throw appError('error_calculate_tool_count_first')"],
  [/throw new Error\('请输入有效的工具间距'\)/g, "throw appError('error_invalid_tool_spacing')"],
  [/throw new Error\('双向布局时，工具数量必须为2'\)/g, "throw appError('error_double_layout_requires_two_tools')"],
  [/throw new Error\('写入操作正在进行中，请稍候'\)/g, "throw appError('error_write_in_progress')"],
  [/throw new Error\('参考点坐标无效，请重新读取参考点'\)/g, "throw appError('error_reference_coords_invalid')"],
  [/throw new Error\('参考点1和参考点2重合，无法计算行方向'\)/g, "throw appError('error_reference_points_overlap_row')"],
  [/throw new Error\('参考点1和参考点3重合，无法计算列方向'\)/g, "throw appError('error_reference_points_overlap_col')"],
];

for (const [re, rep] of replacements) {
  s = s.replace(re, rep);
}

s = s.replace(
  /async function postWriteJson\(url, body, fallbackMessage\) \{[\s\S]*?return data;\n\}/,
  `async function postWriteJson(url, body, fallbackKey = 'error_request_failed') {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (data.error_code) {
            throw appError(data.error_code, data.params || {});
        }
        throw appError(fallbackKey, data.params || {});
    }

    return data;
}`
);

s = s.replace(
  /throw new Error\(`\$\{sourceName\}\$\{axisName\.toUpperCase\(\)\}值无效`\);/,
  "throw appError('error_invalid_axis_value', { source: sourceName, axis: axisName.toUpperCase() });"
);

s = s.replace(
  "const angleSourceName = currentRecipeType === 'manual' ? '参考点1' : 'Z&C参考寄存器';",
  "const angleSourceName = currentRecipeType === 'manual' ? t('manual_planning_ref1_label') : t('smart_planning_zc_ref_label');"
);

s = s.replace(
  "postWriteJson('/get_tf_data', { tf_id: 1 }, '\u8bfb\u53d6TF1\u6570\u636e\u5931\u8d25')",
  "postWriteJson('/get_tf_data', { tf_id: 1 }, 'error_read_tf1_failed')"
);
s = s.replace(
  "postWriteJson('/update_tf_data', { tf_updates: tfUpdates }, '\u66f4\u65b0TF\u6570\u636e\u5931\u8d25')",
  "postWriteJson('/update_tf_data', { tf_updates: tfUpdates }, 'error_tf_update_failed')"
);
s = s.replace(
  "}, '\u8bfb\u53d6\u53c2\u8003\u70b91\u5931\u8d25')",
  "}, 'error_read_reference1_failed')"
);

// Fix monitoring status displays that still append raw error
s = s.replace(/updateStatusDisplay\(t\('error_robot_status_check_failed'\) \+ data\.error/g, "updateStatusDisplay(t('error_robot_status_check_failed') + resolveApiError(data)");
s = s.replace(/updateStatusDisplay\(t\('error_check_running_program_failed'\) \+ data\.error/g, "updateStatusDisplay(t('error_check_running_program_failed') + resolveApiError(data)");
s = s.replace(/updateStatusDisplay\(t\('monitoring_status_auto_write_failed'\) \+ error\.message/g, "updateStatusDisplay(t('monitoring_status_auto_write_failed') + formatAppError(error)");

// Import message block
s = s.replace(
  /let message = resolveApiMessage\(data\) \|\| data\.message;/,
  'let message = resolveApiMessage(data);'
);

fs.writeFileSync(filePath, s);
const remaining = (s.match(/throw new Error/g) || []).length;
console.log('script.js patched, remaining throw new Error:', remaining);
if (remaining) {
  const lines = s.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('throw new Error')) {
      console.log(i + 1, line.trim());
    }
  });
}
