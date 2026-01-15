// 国际化翻译文件
const translations = {
    'zh': {
        // 标题栏
        'title': '捷勃特智能摆盘规划系统',
        
        // 侧边栏菜单
        'menu_robot_settings': '机器人设置',
        'menu_smart_planning': '智能规划',
        'menu_manual_planning': '手动规划',
        'menu_data_list': '数据清单',
        'menu_recipe_library': '配方库',
        
        // 机器人设置
        'robot_ip_label': '机器人IP地址:',
        'robot_ip_placeholder': '输入机器人IP地址',
        'connect': '连接',
        'disconnect': '断开连接',
        'connection_status': '连接状态:',
        'robot_model': '型号:',
        'controller_version': '控制柜版本:',
        'program_name': '程序名称:',
        'program_name_placeholder': '输入程序名称',
        'read_p_data': '读取P点',
        'pr_register_id': 'Z&C参考寄存器:',
        'uf_value': 'UF值:',
        'tool_count': '工具数量:',
        'tool_spacing': '工具间距:',
        'tool_direction': '工具方向:',
        'tool_direction_y': 'Y方向',
        'tool_direction_x': 'X方向',
        'tool_layout': '工具布局:',
        'tool_layout_single': '单侧',
        'tool_layout_double': '双向',
        'auto_tf': '自动TF计算:',
        'auto_tf_off': '关闭',
        'auto_tf_on': '开启',
        'left_right': '坐标系方向:',
        'left_right_right': '右手坐标系',
        'left_right_left': '左手坐标系',
        'p_data_table_title': 'P点数据',
        'p_data_table_no': '序号',
        'p_data_table_x': 'X',
        'p_data_table_y': 'Y',
        'p_data_table_z': 'Z',
        'p_data_table_c': 'C',
        'p_data_table_uf': 'UF',
        'p_data_table_tf': 'TF',
        'p_data_table_coord': '坐标系方向',
        
        // 智能规划
        'frame_settings': '料框设置',
        'frame_length': '料框长度:',
        'frame_width': '料框宽度:',
        'frame_depth': '料框深度:',
        'workpiece_settings': '工件设置',
        'workpiece_type': '工件类型:',
        'workpiece_type_circle': '圆形',
        'workpiece_type_rectangle': '长方形',
        'workpiece_type_polygon': '多边形',
        'workpiece_type_triangle': '三角形',
        'circle_diameter': '圆形直径:',
        'rectangle_length': '长方形长度:',
        'rectangle_width': '长方形宽度:',
        'polygon_sides': '多边形边数 (5-8):',
        'polygon_side_length': '多边形边长:',
        'polygon_arrangement': '排布方式:',
        'polygon_arrangement_diagonal': '对角排布',
        'polygon_arrangement_edge': '对边排布',
        'triangle_type': '三角形类型:',
        'triangle_type_equilateral': '等边三角形',
        'triangle_type_isosceles': '等腰三角形',
        'triangle_side_length': '三角形边长:',
        'triangle_base_length': '三角形底边长:',
        'triangle_orientation': '三角形朝向:',
        'triangle_orientation_up': '朝上',
        'triangle_orientation_down': '朝下',
        'triangle_orientation_left': '朝左',
        'triangle_orientation_right': '朝右',
        'workpiece_height': '工件高度:',
        'drop_count': '前端单次下料数量:',
        'placement_settings': '摆放设置',
        'horizontal_spacing': '横向间距:',
        'vertical_spacing': '纵向间距:',
        'horizontal_border_distance': '横向边框距离:',
        'vertical_border_distance': '纵向边框距离:',
        'material_thickness': '包材厚度:',
        'placement_layers': '摆放层数:',
        'layout_type': '排布方式:',
        'layout_type_array': '阵列式',
        'layout_type_honeycomb': '蜂窝式',
        'place_type': '摆盘方式:',
        'place_type_row': '行优先',
        'place_type_col': '列优先',
        'remainder_turn': '余行列转向:',
        'remainder_turn_off': '关闭',
        'remainder_turn_left': '左转90度',
        'remainder_turn_right': '右转90度',
        'calculate': '计算',
        'planning_result_preview': '规划结果预览',
        'shape_count': '可填充的图形数量：',
        'shapes_per_row_or_col': '单行/列填充数量：',
        
        // 数据清单
        'compensation_instructions': '补偿使用说明',
        'compensation_instruction_1': '1、规划页面重新计算则清除所有的补偿值，重新生成数据表单。',
        'compensation_instruction_2': '2、可选单行/列以及编号，输入补偿值和角度补偿，点击更新按钮，补偿值显示在数据清单中。',
        'compensation_instruction_3': '3、如需修改多行，则多次输入补偿更新即可。',
        'compensation_instruction_4': '4、数据修改完成后，输入程序名，点击写入P点。',
        'compensation_instruction_5': '5、行补偿Y值，列补偿X值。',
        'compensation_type': '补偿行/列:',
        'compensation_type_row': '行',
        'compensation_type_col': '列',
        'row_col_number': '行号/列号:',
        'compensation_value': '补偿值:',
        'angle_compensation': '角度补偿:',
        'update_compensation': '更新补偿',
        'write_program_name': '程序名称:',
        'write_p_data': '写入P点',
        'recipe_name': '配方名:',
        'recipe_id': '配方编号:',
        'save_recipe': '保存配方',
        'data_list_row': '行号',
        'data_list_col': '列号',
        'data_list_p_id': 'P_ID',
        'data_list_x': 'X',
        'data_list_x_comp': 'X补偿',
        'data_list_y': 'Y',
        'data_list_y_comp': 'Y补偿',
        'data_list_c': 'C',
        'data_list_c_comp': 'C补偿',
        
        // 手动规划
        'grid_parameters': '网格参数',
        'row_count': '行数:',
        'row_count_placeholder': '输入行数',
        'col_count': '列数:',
        'col_count_placeholder': '输入列数',
        'calculation_method': '计算方式:',
        'calculation_method_row': '行优先',
        'calculation_method_col': '列优先',
        'manual_planning_recipe_info': '手动规划配方信息',
        'point_total_count': '点位总数:',
        'read_reference_points': '读取参考点',
        'reference_points_title': '参考点坐标',
        'reference_point': '参考点',
        'reference_point_pr1': 'PR1 (第一行第一列)',
        'reference_point_pr2': 'PR2 (最后一行第一列)',
        'reference_point_pr3': 'PR3 (第一行最后一列)',
        'calculate_points': '计算所有点位',
        'calculating': '正在计算...',
        
        // 配方库
        'search_recipe': '查找配方:',
        'search_recipe_placeholder': '输入配方名',
        'recipe_number_mh': '配方号MH:',
        'recipe_number_mh_placeholder': '输入配方号MH',
        'call_signal_di': '调用信号DI:',
        'call_signal_di_placeholder': '输入调用信号DI',
        'finish_signal_do': '完成信号DO:',
        'finish_signal_do_placeholder': '输入完成信号DO',
        'external_call': '允许外部调用:',
        'external_call_off': '关闭',
        'external_call_on': '开启',
        'auto_write': '自动写入:',
        'auto_write_off': '关闭',
        'auto_write_on': '开启',
        'monitoring_status': '监控状态:',
        'monitoring_status_stopped': '未启动',
        'recipe_list': '配方列表',
        'select_all': '全选',
        'export_selected': '导出选中配方',
        'import_recipes': '导入配方',
        'recipe_preview': '配方预览',
        'read_recipe': '读取',
        'delete_recipe': '删除',
        
        // 消息提示
        'error_connect_failed': '连接失败: ',
        'error_disconnect_failed': '断开连接失败: ',
        'error_timeout': '请求超时: 请检查网络连接或稍后重试',
        'error_robot_status_check_failed': '机器人状态检查失败: ',
        'error_check_running_program_failed': '检查运行程序失败: ',
        'error_input_required': '请先输入配方号MH、调用信号DI和完成信号DO',
        'error_monitoring_failed': '监控错误: ',
        'error_get_recipe_list_failed': '获取配方列表失败: ',
        'error_load_recipe_failed': '加载配方失败: ',
        'error_auto_write_failed': '自动写入失败: ',
        'error_read_pr_failed': '读取PR寄存器失败',
        'success_recipe_auto_write': '配方 {name} 自动写入成功！',
        'success_recipe_loaded': '配方加载成功: ',
        'monitoring_status_monitoring': '监控状态: 正在监控 DI{signal} 信号，等待触发...',
        'monitoring_status_stopped_text': '监控状态: 已停止',
        'monitoring_status_processing': '正在自动写入中，暂停接收新的配方调用...',
        'monitoring_status_triggered': '检测到触发信号，MH值: {mh}，正在加载配方...',
        'monitoring_status_auto_write_complete': '自动写入完成',
        'monitoring_status_auto_write_failed': '自动写入失败: ',
        'id_reassignment_notification': '配方号自动分配通知',
        'id_reassignment_message': '以下配方存在配方号重复，系统将自动分配新的配方号：',
        'id_reassignment_note': '说明：这些配方的内容不会改变，只是配方号会被重新分配到可用的号码。',
        'cancel_import': '取消导入',
        'confirm_continue': '确认继续',
        'name_conflict_resolution': '配方名称冲突解决',
        'name_conflict_message': '以下配方名称已存在，请选择处理方式：',
        'name_conflict_option_skip': '跳过（不导入）',
        'name_conflict_option_replace': '替换（覆盖现有配方）',
        'name_conflict_option_rename': '重命名（添加后缀）',
        'cancel': '取消',
        'confirm': '确认',
        
        // 语言切换
        'language': '语言',
        'language_zh': '中文',
        'language_en': 'English'
    },
    'en': {
        // Header
        'title': 'Agilebot Intelligent Layout Planning System',
        
        // Sidebar menu
        'menu_robot_settings': 'Robot Settings',
        'menu_smart_planning': 'Smart Planning',
        'menu_manual_planning': 'Manual Planning',
        'menu_data_list': 'Data List',
        'menu_recipe_library': 'Recipe Library',
        
        // Robot Settings
        'robot_ip_label': 'Robot IP Address:',
        'robot_ip_placeholder': 'Enter robot IP address',
        'connect': 'Connect',
        'disconnect': 'Disconnect',
        'connection_status': 'Connection Status:',
        'robot_model': 'Model:',
        'controller_version': 'Controller Version:',
        'program_name': 'Program Name:',
        'program_name_placeholder': 'Enter program name',
        'read_p_data': 'Read P Points',
        'pr_register_id': 'Z&C Reference Register:',
        'uf_value': 'UF Value:',
        'tool_count': 'Tool Count:',
        'tool_spacing': 'Tool Spacing:',
        'tool_direction': 'Tool Direction:',
        'tool_direction_y': 'Y Direction',
        'tool_direction_x': 'X Direction',
        'tool_layout': 'Tool Layout:',
        'tool_layout_single': 'Single Side',
        'tool_layout_double': 'Double Side',
        'auto_tf': 'Auto TF Calculation:',
        'auto_tf_off': 'Off',
        'auto_tf_on': 'On',
        'left_right': 'Coordinate System Direction:',
        'left_right_right': 'Right-Handed',
        'left_right_left': 'Left-Handed',
        'p_data_table_title': 'P Point Data',
        'p_data_table_no': 'No.',
        'p_data_table_x': 'X',
        'p_data_table_y': 'Y',
        'p_data_table_z': 'Z',
        'p_data_table_c': 'C',
        'p_data_table_uf': 'UF',
        'p_data_table_tf': 'TF',
        'p_data_table_coord': 'Coordinate Direction',
        
        // Smart Planning
        'frame_settings': 'Frame Settings',
        'frame_length': 'Frame Length:',
        'frame_width': 'Frame Width:',
        'frame_depth': 'Frame Depth:',
        'workpiece_settings': 'Workpiece Settings',
        'workpiece_type': 'Workpiece Type:',
        'workpiece_type_circle': 'Circle',
        'workpiece_type_rectangle': 'Rectangle',
        'workpiece_type_polygon': 'Polygon',
        'workpiece_type_triangle': 'Triangle',
        'circle_diameter': 'Circle Diameter:',
        'rectangle_length': 'Rectangle Length:',
        'rectangle_width': 'Rectangle Width:',
        'polygon_sides': 'Polygon Sides (5-8):',
        'polygon_side_length': 'Polygon Side Length:',
        'polygon_arrangement': 'Arrangement:',
        'polygon_arrangement_diagonal': 'Diagonal',
        'polygon_arrangement_edge': 'Edge',
        'triangle_type': 'Triangle Type:',
        'triangle_type_equilateral': 'Equilateral',
        'triangle_type_isosceles': 'Isosceles',
        'triangle_side_length': 'Triangle Side Length:',
        'triangle_base_length': 'Triangle Base Length:',
        'triangle_orientation': 'Triangle Orientation:',
        'triangle_orientation_up': 'Up',
        'triangle_orientation_down': 'Down',
        'triangle_orientation_left': 'Left',
        'triangle_orientation_right': 'Right',
        'workpiece_height': 'Workpiece Height:',
        'drop_count': 'Front-end Single Drop Count:',
        'placement_settings': 'Placement Settings',
        'horizontal_spacing': 'Horizontal Spacing:',
        'vertical_spacing': 'Vertical Spacing:',
        'vertical_border_distance': 'Vertical Border Distance:',
        'horizontal_border_distance': 'Horizontal Border Distance:',
        'material_thickness': 'Material Thickness:',
        'placement_layers': 'Placement Layers:',
        'layout_type': 'Layout Type:',
        'layout_type_array': 'Array',
        'layout_type_honeycomb': 'Honeycomb',
        'place_type': 'Placement Method:',
        'place_type_row': 'Row Priority',
        'place_type_col': 'Column Priority',
        'remainder_turn': 'Remainder Turn:',
        'remainder_turn_off': 'Off',
        'remainder_turn_left': 'Left 90°',
        'remainder_turn_right': 'Right 90°',
        'calculate': 'Calculate',
        'planning_result_preview': 'Planning Result Preview',
        'shape_count': 'Fillable Shape Count: ',
        'shapes_per_row_or_col': 'Shapes per Row/Column: ',
        
        // Data List
        'compensation_instructions': 'Compensation Instructions',
        'compensation_instruction_1': '1. Recalculating on the planning page will clear all compensation values and regenerate the data form.',
        'compensation_instruction_2': '2. Select a row/column and number, enter compensation value and angle compensation, click update button, compensation value will be displayed in the data list.',
        'compensation_instruction_3': '3. To modify multiple rows, enter compensation updates multiple times.',
        'compensation_instruction_4': '4. After data modification is complete, enter program name and click Write P Points.',
        'compensation_instruction_5': '5. Row compensation is Y value, column compensation is X value.',
        'compensation_type': 'Compensation Row/Column:',
        'compensation_type_row': 'Row',
        'compensation_type_col': 'Column',
        'row_col_number': 'Row/Column Number:',
        'compensation_value': 'Compensation Value:',
        'angle_compensation': 'Angle Compensation:',
        'update_compensation': 'Update Compensation',
        'write_program_name': 'Program Name:',
        'write_p_data': 'Write P Points',
        'recipe_name': 'Recipe Name:',
        'recipe_id': 'Recipe ID:',
        'save_recipe': 'Save Recipe',
        'data_list_row': 'Row',
        'data_list_col': 'Column',
        'data_list_p_id': 'P_ID',
        'data_list_x': 'X',
        'data_list_x_comp': 'X Comp',
        'data_list_y': 'Y',
        'data_list_y_comp': 'Y Comp',
        'data_list_c': 'C',
        'data_list_c_comp': 'C Comp',
        
        // Manual Planning
        'grid_parameters': 'Grid Parameters',
        'row_count': 'Row Count:',
        'row_count_placeholder': 'Enter row count',
        'col_count': 'Column Count:',
        'col_count_placeholder': 'Enter column count',
        'calculation_method': 'Calculation Method:',
        'calculation_method_row': 'Row Priority',
        'calculation_method_col': 'Column Priority',
        'manual_planning_recipe_info': 'Manual Planning Recipe Info',
        'point_total_count': 'Total Points:',
        'read_reference_points': 'Read Reference Points',
        'reference_points_title': 'Reference Point Coordinates',
        'reference_point': 'Reference Point',
        'reference_point_pr1': 'PR1 (First Row, First Column)',
        'reference_point_pr2': 'PR2 (Last Row, First Column)',
        'reference_point_pr3': 'PR3 (First Row, Last Column)',
        'calculate_points': 'Calculate All Points',
        'calculating': 'Calculating...',
        
        // Recipe Library
        'search_recipe': 'Search Recipe:',
        'search_recipe_placeholder': 'Enter recipe name',
        'recipe_number_mh': 'Recipe Number MH:',
        'recipe_number_mh_placeholder': 'Enter recipe number MH',
        'call_signal_di': 'Call Signal DI:',
        'call_signal_di_placeholder': 'Enter call signal DI',
        'finish_signal_do': 'Finish Signal DO:',
        'finish_signal_do_placeholder': 'Enter finish signal DO',
        'external_call': 'Allow External Call:',
        'external_call_off': 'Off',
        'external_call_on': 'On',
        'auto_write': 'Auto Write:',
        'auto_write_off': 'Off',
        'auto_write_on': 'On',
        'monitoring_status': 'Monitoring Status:',
        'monitoring_status_stopped': 'Not Started',
        'recipe_list': 'Recipe List',
        'select_all': 'Select All',
        'export_selected': 'Export Selected Recipes',
        'import_recipes': 'Import Recipes',
        'recipe_preview': 'Recipe Preview',
        'read_recipe': 'Read',
        'delete_recipe': 'Delete',
        
        // Messages
        'error_connect_failed': 'Connection failed: ',
        'error_disconnect_failed': 'Disconnect failed: ',
        'error_timeout': 'Request timeout: Please check network connection or try again later',
        'error_robot_status_check_failed': 'Robot status check failed: ',
        'error_check_running_program_failed': 'Check running program failed: ',
        'error_input_required': 'Please enter recipe number MH, call signal DI and finish signal DO first',
        'error_monitoring_failed': 'Monitoring error: ',
        'error_get_recipe_list_failed': 'Failed to get recipe list: ',
        'error_load_recipe_failed': 'Failed to load recipe: ',
        'error_auto_write_failed': 'Auto write failed: ',
        'error_read_pr_failed': 'Failed to read PR register',
        'success_recipe_auto_write': 'Recipe {name} auto write successful!',
        'success_recipe_loaded': 'Recipe loaded successfully: ',
        'monitoring_status_monitoring': 'Monitoring Status: Monitoring DI{signal} signal, waiting for trigger...',
        'monitoring_status_stopped_text': 'Monitoring Status: Stopped',
        'monitoring_status_processing': 'Auto writing in progress, pausing to receive new recipe calls...',
        'monitoring_status_triggered': 'Trigger signal detected, MH value: {mh}, loading recipe...',
        'monitoring_status_auto_write_complete': 'Auto write completed',
        'monitoring_status_auto_write_failed': 'Auto write failed: ',
        'id_reassignment_notification': 'Recipe Number Auto Assignment Notification',
        'id_reassignment_message': 'The following recipes have duplicate recipe numbers, the system will automatically assign new recipe numbers:',
        'id_reassignment_note': 'Note: The content of these recipes will not change, only the recipe numbers will be reassigned to available numbers.',
        'cancel_import': 'Cancel Import',
        'confirm_continue': 'Confirm Continue',
        'name_conflict_resolution': 'Recipe Name Conflict Resolution',
        'name_conflict_message': 'The following recipe names already exist, please select a handling method:',
        'name_conflict_option_skip': 'Skip (Do not import)',
        'name_conflict_option_replace': 'Replace (Overwrite existing recipe)',
        'name_conflict_option_rename': 'Rename (Add suffix)',
        'cancel': 'Cancel',
        'confirm': 'Confirm',
        
        // Language Switch
        'language': 'Language',
        'language_zh': '中文',
        'language_en': 'English',
        'language_vi': 'Tiếng Việt'
    },
    'vi': {
        // Header
        'title': 'Hệ Thống Lập Kế Hoạch Bố Trí Thông Minh Agilebot',
        
        // Sidebar menu
        'menu_robot_settings': 'Cài Đặt Robot',
        'menu_smart_planning': 'Lập Kế Hoạch Thông Minh',
        'menu_manual_planning': 'Lập Kế Hoạch Thủ Công',
        'menu_data_list': 'Danh Sách Dữ Liệu',
        'menu_recipe_library': 'Thư Viện Công Thức',
        
        // Robot Settings
        'robot_ip_label': 'Địa Chỉ IP Robot:',
        'robot_ip_placeholder': 'Nhập địa chỉ IP robot',
        'connect': 'Kết Nối',
        'disconnect': 'Ngắt Kết Nối',
        'connection_status': 'Trạng Thái Kết Nối:',
        'robot_model': 'Model:',
        'controller_version': 'Phiên Bản Bộ Điều Khiển:',
        'program_name': 'Tên Chương Trình:',
        'program_name_placeholder': 'Nhập tên chương trình',
        'read_p_data': 'Đọc Điểm P',
        'pr_register_id': 'Thanh Ghi Tham Chiếu Z&C:',
        'uf_value': 'Giá Trị UF:',
        'tool_count': 'Số Lượng Công Cụ:',
        'tool_spacing': 'Khoảng Cách Công Cụ:',
        'tool_direction': 'Hướng Công Cụ:',
        'tool_direction_y': 'Hướng Y',
        'tool_direction_x': 'Hướng X',
        'tool_layout': 'Bố Trí Công Cụ:',
        'tool_layout_single': 'Một Bên',
        'tool_layout_double': 'Hai Bên',
        'auto_tf': 'Tính Toán TF Tự Động:',
        'auto_tf_off': 'Tắt',
        'auto_tf_on': 'Bật',
        'left_right': 'Hướng Hệ Tọa Độ:',
        'left_right_right': 'Hệ Tọa Độ Tay Phải',
        'left_right_left': 'Hệ Tọa Độ Tay Trái',
        'p_data_table_title': 'Dữ Liệu Điểm P',
        'p_data_table_no': 'Số Thứ Tự',
        'p_data_table_x': 'X',
        'p_data_table_y': 'Y',
        'p_data_table_z': 'Z',
        'p_data_table_c': 'C',
        'p_data_table_uf': 'UF',
        'p_data_table_tf': 'TF',
        'p_data_table_coord': 'Hướng Hệ Tọa Độ',
        
        // Smart Planning
        'frame_settings': 'Cài Đặt Khung',
        'frame_length': 'Chiều Dài Khung:',
        'frame_width': 'Chiều Rộng Khung:',
        'frame_depth': 'Chiều Sâu Khung:',
        'workpiece_settings': 'Cài Đặt Chi Tiết',
        'workpiece_type': 'Loại Chi Tiết:',
        'workpiece_type_circle': 'Hình Tròn',
        'workpiece_type_rectangle': 'Hình Chữ Nhật',
        'workpiece_type_polygon': 'Đa Giác',
        'workpiece_type_triangle': 'Tam Giác',
        'circle_diameter': 'Đường Kính Hình Tròn:',
        'rectangle_length': 'Chiều Dài Hình Chữ Nhật:',
        'rectangle_width': 'Chiều Rộng Hình Chữ Nhật:',
        'polygon_sides': 'Số Cạnh Đa Giác (5-8):',
        'polygon_side_length': 'Độ Dài Cạnh Đa Giác:',
        'polygon_arrangement': 'Cách Bố Trí:',
        'polygon_arrangement_diagonal': 'Bố Trí Đường Chéo',
        'polygon_arrangement_edge': 'Bố Trí Cạnh',
        'triangle_type': 'Loại Tam Giác:',
        'triangle_type_equilateral': 'Tam Giác Đều',
        'triangle_type_isosceles': 'Tam Giác Cân',
        'triangle_side_length': 'Độ Dài Cạnh Tam Giác:',
        'triangle_base_length': 'Độ Dài Đáy Tam Giác:',
        'triangle_orientation': 'Hướng Tam Giác:',
        'triangle_orientation_up': 'Hướng Lên',
        'triangle_orientation_down': 'Hướng Xuống',
        'triangle_orientation_left': 'Hướng Trái',
        'triangle_orientation_right': 'Hướng Phải',
        'workpiece_height': 'Chiều Cao Chi Tiết:',
        'drop_count': 'Số Lượng Thả Một Lần Phía Trước:',
        'placement_settings': 'Cài Đặt Đặt',
        'horizontal_spacing': 'Khoảng Cách Ngang:',
        'vertical_spacing': 'Khoảng Cách Dọc:',
        'horizontal_border_distance': 'Khoảng Cách Viền Ngang:',
        'vertical_border_distance': 'Khoảng Cách Viền Dọc:',
        'material_thickness': 'Độ Dày Vật Liệu:',
        'placement_layers': 'Số Lớp Đặt:',
        'layout_type': 'Loại Bố Trí:',
        'layout_type_array': 'Mảng',
        'layout_type_honeycomb': 'Tổ Ong',
        'place_type': 'Phương Pháp Đặt:',
        'place_type_row': 'Ưu Tiên Hàng',
        'place_type_col': 'Ưu Tiên Cột',
        'remainder_turn': 'Xoay Phần Dư:',
        'remainder_turn_off': 'Tắt',
        'remainder_turn_left': 'Xoay Trái 90°',
        'remainder_turn_right': 'Xoay Phải 90°',
        'calculate': 'Tính Toán',
        'planning_result_preview': 'Xem Trước Kết Quả Lập Kế Hoạch',
        'shape_count': 'Số Lượng Hình Có Thể Điền: ',
        'shapes_per_row_or_col': 'Số Hình Mỗi Hàng/Cột: ',
        
        // Data List
        'compensation_instructions': 'Hướng Dẫn Sử Dụng Bù',
        'compensation_instruction_1': '1. Tính toán lại trên trang lập kế hoạch sẽ xóa tất cả giá trị bù và tạo lại biểu mẫu dữ liệu.',
        'compensation_instruction_2': '2. Chọn hàng/cột và số, nhập giá trị bù và bù góc, nhấp nút cập nhật, giá trị bù sẽ hiển thị trong danh sách dữ liệu.',
        'compensation_instruction_3': '3. Để sửa đổi nhiều hàng, nhập cập nhật bù nhiều lần.',
        'compensation_instruction_4': '4. Sau khi hoàn tất sửa đổi dữ liệu, nhập tên chương trình và nhấp Ghi Điểm P.',
        'compensation_instruction_5': '5. Bù hàng là giá trị Y, bù cột là giá trị X.',
        'compensation_type': 'Bù Hàng/Cột:',
        'compensation_type_row': 'Hàng',
        'compensation_type_col': 'Cột',
        'row_col_number': 'Số Hàng/Cột:',
        'compensation_value': 'Giá Trị Bù:',
        'angle_compensation': 'Bù Góc:',
        'update_compensation': 'Cập Nhật Bù',
        'write_program_name': 'Tên Chương Trình:',
        'write_p_data': 'Ghi Điểm P',
        'recipe_name': 'Tên Công Thức:',
        'recipe_id': 'ID Công Thức:',
        'save_recipe': 'Lưu Công Thức',
        'data_list_row': 'Hàng',
        'data_list_col': 'Cột',
        'data_list_p_id': 'P_ID',
        'data_list_x': 'X',
        'data_list_x_comp': 'Bù X',
        'data_list_y': 'Y',
        'data_list_y_comp': 'Bù Y',
        'data_list_c': 'C',
        'data_list_c_comp': 'Bù C',
        
        // Manual Planning
        'grid_parameters': 'Tham Số Lưới',
        'row_count': 'Số Hàng:',
        'row_count_placeholder': 'Nhập số hàng',
        'col_count': 'Số Cột:',
        'col_count_placeholder': 'Nhập số cột',
        'calculation_method': 'Phương Pháp Tính Toán:',
        'calculation_method_row': 'Ưu Tiên Hàng',
        'calculation_method_col': 'Ưu Tiên Cột',
        'manual_planning_recipe_info': 'Thông Tin Công Thức Lập Kế Hoạch Thủ Công',
        'point_total_count': 'Tổng Số Điểm:',
        'read_reference_points': 'Đọc Điểm Tham Chiếu',
        'reference_points_title': 'Tọa Độ Điểm Tham Chiếu',
        'reference_point': 'Điểm Tham Chiếu',
        'reference_point_pr1': 'PR1 (Hàng Đầu, Cột Đầu)',
        'reference_point_pr2': 'PR2 (Hàng Cuối, Cột Đầu)',
        'reference_point_pr3': 'PR3 (Hàng Đầu, Cột Cuối)',
        'calculate_points': 'Tính Toán Tất Cả Điểm',
        'calculating': 'Đang tính toán...',
        
        // Recipe Library
        'search_recipe': 'Tìm Công Thức:',
        'search_recipe_placeholder': 'Nhập tên công thức',
        'recipe_number_mh': 'Số Công Thức MH:',
        'recipe_number_mh_placeholder': 'Nhập số công thức MH',
        'call_signal_di': 'Tín Hiệu Gọi DI:',
        'call_signal_di_placeholder': 'Nhập tín hiệu gọi DI',
        'finish_signal_do': 'Tín Hiệu Hoàn Thành DO:',
        'finish_signal_do_placeholder': 'Nhập tín hiệu hoàn thành DO',
        'external_call': 'Cho Phép Gọi Bên Ngoài:',
        'external_call_off': 'Tắt',
        'external_call_on': 'Bật',
        'auto_write': 'Ghi Tự Động:',
        'auto_write_off': 'Tắt',
        'auto_write_on': 'Bật',
        'monitoring_status': 'Trạng Thái Giám Sát:',
        'monitoring_status_stopped': 'Chưa Khởi Động',
        'recipe_list': 'Danh Sách Công Thức',
        'select_all': 'Chọn Tất Cả',
        'export_selected': 'Xuất Công Thức Đã Chọn',
        'import_recipes': 'Nhập Công Thức',
        'recipe_preview': 'Xem Trước Công Thức',
        'read_recipe': 'Đọc',
        'delete_recipe': 'Xóa',
        
        // Messages
        'error_connect_failed': 'Kết nối thất bại: ',
        'error_disconnect_failed': 'Ngắt kết nối thất bại: ',
        'error_timeout': 'Hết thời gian chờ: Vui lòng kiểm tra kết nối mạng hoặc thử lại sau',
        'error_robot_status_check_failed': 'Kiểm tra trạng thái robot thất bại: ',
        'error_check_running_program_failed': 'Kiểm tra chương trình đang chạy thất bại: ',
        'error_input_required': 'Vui lòng nhập số công thức MH, tín hiệu gọi DI và tín hiệu hoàn thành DO trước',
        'error_monitoring_failed': 'Lỗi giám sát: ',
        'error_get_recipe_list_failed': 'Lấy danh sách công thức thất bại: ',
        'error_load_recipe_failed': 'Tải công thức thất bại: ',
        'error_auto_write_failed': 'Ghi tự động thất bại: ',
        'error_read_pr_failed': 'Đọc thanh ghi PR thất bại',
        'success_recipe_auto_write': 'Công thức {name} ghi tự động thành công!',
        'success_recipe_loaded': 'Tải công thức thành công: ',
        'monitoring_status_monitoring': 'Trạng Thái Giám Sát: Đang giám sát tín hiệu DI{signal}, chờ kích hoạt...',
        'monitoring_status_stopped_text': 'Trạng Thái Giám Sát: Đã dừng',
        'monitoring_status_processing': 'Đang ghi tự động, tạm dừng nhận lời gọi công thức mới...',
        'monitoring_status_triggered': 'Phát hiện tín hiệu kích hoạt, giá trị MH: {mh}, đang tải công thức...',
        'monitoring_status_auto_write_complete': 'Ghi tự động hoàn tất',
        'monitoring_status_auto_write_failed': 'Ghi tự động thất bại: ',
        'id_reassignment_notification': 'Thông Báo Phân Bổ Số Công Thức Tự Động',
        'id_reassignment_message': 'Các công thức sau có số công thức trùng lặp, hệ thống sẽ tự động phân bổ số công thức mới:',
        'id_reassignment_note': 'Lưu ý: Nội dung của các công thức này sẽ không thay đổi, chỉ có số công thức sẽ được phân bổ lại cho các số có sẵn.',
        'cancel_import': 'Hủy Nhập',
        'confirm_continue': 'Xác Nhận Tiếp Tục',
        'name_conflict_resolution': 'Giải Quyết Xung Đột Tên Công Thức',
        'name_conflict_message': 'Các tên công thức sau đã tồn tại, vui lòng chọn phương thức xử lý:',
        'name_conflict_option_skip': 'Bỏ Qua (Không nhập)',
        'name_conflict_option_replace': 'Thay Thế (Ghi đè công thức hiện có)',
        'name_conflict_option_rename': 'Đổi Tên (Thêm hậu tố)',
        'cancel': 'Hủy',
        'confirm': 'Xác Nhận',
        
        // Language Switch
        'language': 'Ngôn Ngữ',
        'language_zh': '中文',
        'language_en': 'English',
        'language_vi': 'Tiếng Việt'
    }
};

// 获取当前语言，默认中文
function getCurrentLanguage() {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'zh';
}

// 设置语言
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    applyLanguage(lang);
}

// 应用语言
function applyLanguage(lang) {
    // 确保语言代码有效，如果不存在则使用中文
    if (!translations[lang]) {
        console.warn('Language not found:', lang, 'Available languages:', Object.keys(translations), 'falling back to zh');
        lang = 'zh';
    }
    const currentLang = translations[lang] || translations['zh'];
    console.log('应用语言:', lang, '翻译对象存在:', !!currentLang);
    
    // 翻译所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentLang[key]) {
            // 如果是input的placeholder
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = currentLang[key];
            } else if (element.tagName === 'OPTION') {
                // 选项文本 - 检查选项是否有data-i18n属性
                if (element.hasAttribute('data-i18n')) {
                    element.textContent = currentLang[key];
                }
            } else if (element.tagName === 'LABEL') {
                // 标签文本
                element.textContent = currentLang[key];
            } else if (element.tagName === 'BUTTON') {
                // 按钮文本 - 对于连接按钮需要特殊处理，保持连接状态
                if (element.id === 'robot_connect_button') {
                    // 检查按钮的data-i18n属性，这是最可靠的状态指示器
                    const buttonKey = element.getAttribute('data-i18n');
                    
                    if (buttonKey === 'disconnect') {
                        // 如果data-i18n是disconnect，显示断开连接
                        element.textContent = currentLang['disconnect'] || '断开连接';
                    } else {
                        // 否则显示连接
                        element.textContent = currentLang['connect'] || '连接';
                    }
                } else {
                    // 其他按钮直接更新文本
                    element.textContent = currentLang[key];
                }
            } else {
                // 其他元素，但排除input的placeholder
                if (!(element.tagName === 'INPUT' && element.hasAttribute('placeholder'))) {
                    element.textContent = currentLang[key];
                }
            }
        }
    });
    
    // 翻译select的选项（通过data-i18n-options属性）
    document.querySelectorAll('select[data-i18n-options]').forEach(select => {
        const optionsKey = select.getAttribute('data-i18n-options');
        const options = optionsKey.split(',');
        options.forEach((optionKey, index) => {
            const option = select.options[index];
            if (option && currentLang[optionKey.trim()]) {
                option.textContent = currentLang[optionKey.trim()];
            }
        });
    });
    
    // 翻译select中带有data-i18n属性的option
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (currentLang[key]) {
            option.textContent = currentLang[key];
        }
    });
    
    // 更新HTML lang属性
    document.documentElement.lang = lang;
}

// 翻译函数，供JavaScript动态内容使用
function t(key, params = {}) {
    if (!key) {
        return '';
    }
    const lang = getCurrentLanguage();
    const currentLang = translations[lang] || translations['zh'];
    if (!currentLang) {
        console.warn('Translation object not found for language:', lang);
        return key;
    }
    let text = currentLang[key];
    if (text === undefined || text === null) {
        console.warn('Translation key not found:', key, 'for language:', lang);
        // 尝试从中文翻译中获取
        if (lang !== 'zh' && translations['zh'] && translations['zh'][key]) {
            text = translations['zh'][key];
        } else {
            text = key;
        }
    }
    
    // 确保返回的是字符串
    text = String(text);
    
    // 替换参数
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// 将t函数暴露到全局作用域，以便在其他脚本中使用
window.t = t;
