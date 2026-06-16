"""One-off migration: replace Chinese API error/message strings with error_code/message_code."""
import re
from pathlib import Path

APP = Path(__file__).resolve().parent.parent / 'app.py'
text = APP.read_text(encoding='utf-8')

if 'from api_responses import api_error, api_success' not in text:
    text = text.replace(
        'from Agilebot.IR.A.extension import Extension\n',
        'from Agilebot.IR.A.extension import Extension\nfrom api_responses import api_error, api_success\n',
    )

# Simple literal replacements
simple_errors = {
    "'无效的请求数据'": "api_error('error_invalid_request')",
    "'未连接机器人'": "api_error('error_not_connected')",
    "'缺少机器人IP地址'": "api_error('error_missing_robot_ip')",
    "'缺少程序名称'": "api_error('error_missing_program_name')",
    "'读取P点数据失败'": "api_error('error_read_p_data_failed')",
    "'缺少程序名称或P点数据'": "api_error('error_missing_program_or_p_data')",
    "'获取机器人状态失败'": "api_error('error_get_robot_status_failed')",
    "'机器人连接已断开'": "api_error('error_robot_disconnected')",
    "'缺少PR寄存器ID'": "api_error('error_missing_pr_id')",
    "'PR寄存器ID必须是整数'": "api_error('error_pr_id_must_be_int')",
    "'读取PR寄存器失败'": "api_error('error_read_pr_failed')",
    "'手动规划配方缺少必要参数'": "api_error('error_manual_recipe_missing_params')",
    "'缺少TF ID'": "api_error('error_missing_tf_id')",
    "'读取TF数据失败'": "api_error('error_read_tf_data_failed')",
    "'缺少TF更新数据'": "api_error('error_missing_tf_update_data')",
    "'缺少仿形形状类型'": "api_error('error_missing_shape_type')",
    "'无效的仿形形状类型'": "api_error('error_invalid_shape_type')",
    "'缺少配方名或配方编号'": "api_error('error_missing_recipe_name_id')",
    "'缺少配方名称'": "api_error('error_missing_recipe_name')",
    "'配方不存在'": "api_error('error_recipe_not_found', status_code=404)",
    "'配方中没有P点数据'": "api_error('error_recipe_no_p_data')",
    "'获取运行程序列表失败'": "api_error('error_get_running_programs_failed')",
    "'缺少DO编号或DO值'": "api_error('error_missing_do_params')",
    "'暂不支持PC版'": "api_error('error_pc_not_supported')",
    "'U盘中未找到autoplan_data目录'": "api_error('error_usb_autoplan_dir_not_found')",
    "'未选择要导入的配方'": "api_error('error_no_import_recipes_selected')",
    "'未选择要检查的配方'": "api_error('error_no_import_recipes_selected')",
    "'缺少时间戳参数'": "api_error('error_missing_timestamp')",
    "'shape_width 不能为空'": "api_error('error_shape_width_required')",
}

for old, new in simple_errors.items():
    text = text.replace(f"return JSONResponse({{'error': {old}}}, 400)", f"return {new}")
    text = text.replace(f"return JSONResponse({{'error': {old}}}, 404)", f"return {new}")

# Success messages
simple_success = {
    "'已断开连接'": "api_success('success_disconnected')",
    "'P点数据写入成功'": "api_success('success_p_data_written')",
    "'手动规划R寄存器写入成功'": "api_success('success_manual_r_written')",
    "'智能规划R寄存器写入成功'": "api_success('success_smart_r_written')",
    "'TF数据更新成功'": "api_success('success_tf_updated')",
    "'配方保存成功'": "api_success('success_recipe_saved')",
}

for old, new in simple_success.items():
    text = text.replace(f"return JSONResponse({{'message': {old}}}, 200)", f"return {new}")

# Generic exception
text = text.replace(
    "return JSONResponse({'error': str(e)}, 400)",
    "return api_error('error_internal', detail=str(e))",
)

# Parameterized patterns via regex
patterns = [
    (r"return JSONResponse\(\{'error': f'缺少必需字段: \{field\}'\}, 400\)",
     "return api_error('error_missing_required_field', field=field)"),
    (r"return JSONResponse\(\{'error': f'机器人当前不处于空闲状态（实际状态：\{state\.msg\}），无法写入P点'\}, 400\)",
     "return api_error('error_robot_not_idle', status=state.msg)"),
    (r"return JSONResponse\(\{'error': f'读取P点 \{pose_id\} 数据失败'\}, 400\)",
     "return api_error('error_read_p_point_failed', id=pose_id)"),
    (r"return JSONResponse\(\{'error': f'写入P点 \{pose_id\} 数据失败'\}, 400\)",
     "return api_error('error_write_p_point_failed', id=pose_id)"),
    (r"return JSONResponse\(\{'error': f'读取TF \{tf_id\} 数据失败'\}, 400\)",
     "return api_error('error_read_tf_failed', id=tf_id)"),
    (r"return JSONResponse\(\{'error': f'更新TF \{tf_id\} 数据失败'\}, 400\)",
     "return api_error('error_update_tf_failed', id=tf_id)"),
    (r"return JSONResponse\(\{'error': f'时间目录 \{timestamp\} 不存在'\}, 400\)",
     "return api_error('error_timestamp_dir_not_found', timestamp=timestamp)"),
    (r"return JSONResponse\(\{'error': f'机器人当前状态：\{state\.msg\}，无法自动写入'\}, 400\)",
     "return api_error('error_robot_status_cannot_auto_write', status=state.msg)"),
    (r"return JSONResponse\(\{'error': f'当前有程序在运行：\{running_programs\}，无法自动写入'\}, 400\)",
     "return api_error('error_program_running_cannot_auto_write', programs=', '.join(running_programs))"),
    (r"return JSONResponse\(\{'error': '获取型号失败: ' \+ ret\.errmsg\}, 400\)",
     "return api_error('error_get_model_failed', error=ret.errmsg)"),
    (r"return JSONResponse\(\{'error': '获取控制柜版本失败: ' \+ ret\.errmsg\}, 400\)",
     "return api_error('error_get_controller_version_failed', error=ret.errmsg)"),
    (r"return JSONResponse\(\{'error': f'导出失败: \{str\(e\)\}'\}, 400\)",
     "return api_error('error_export_failed', detail=str(e))"),
    (r"return JSONResponse\(\{'error': f'读取备份目录失败: \{str\(e\)\}'\}, 400\)",
     "return api_error('error_read_backup_dir_failed', detail=str(e))"),
    (r"return JSONResponse\(\{'error': f'读取U盘配方失败: \{str\(e\)\}'\}, 400\)",
     "return api_error('error_read_usb_recipes_failed', detail=str(e))"),
    (r"return JSONResponse\(\{'error': f'导入失败: \{str\(e\)\}'\}, 400\)",
     "return api_error('error_import_failed', detail=str(e))"),
    (r"return JSONResponse\(\{'error': 'U盘未插入或挂载失败，请插入U盘后重试'\}, 400\)",
     "return api_error('error_usb_mount_failed')"),
    (r"return JSONResponse\(\{'message': f'配方 \{recipe_name\} 自动写入成功'\}, 200\)",
     "return api_success('success_recipe_auto_write', name=recipe_name)"),
]

for pattern, repl in patterns:
    text = re.sub(pattern, repl, text)

# R register writes
for i in range(1, 13):
    text = text.replace(
        f"return JSONResponse({{'error': '写入R{i}寄存器失败'}}, 400)",
        f"return api_error('error_write_r_register_failed', register='R{i}')",
    )
    if i <= 3:
        text = text.replace(
            f"return JSONResponse({{'error': '读取PR{i}寄存器失败'}}, 400)",
            f"return api_error('error_read_pr_register_failed', register='PR{i}')",
        )

# Connect robot error_msg block
connect_block_old = """            if ret == StatusCodeEnum.INVALID_IP_ADDRESS:
                error_msg = '连接失败: IP 地址无效'
            elif ret == StatusCodeEnum.CONNECTION_TIMEOUT:
                error_msg = '连接失败: 连接超时'
            elif ret == StatusCodeEnum.CONTROLLER_ERROR:
                error_msg = '连接失败: 控制器错误，详情请联系开发人员'
            else:
                error_msg = f'连接失败: {ret.errmsg}'

            # 清理连接状态
            robot_arm = None
            return JSONResponse({'error': error_msg}, 400)"""

connect_block_new = """            robot_arm = None
            if ret == StatusCodeEnum.INVALID_IP_ADDRESS:
                return api_error('error_connect_invalid_ip')
            if ret == StatusCodeEnum.CONNECTION_TIMEOUT:
                return api_error('error_connect_timeout')
            if ret == StatusCodeEnum.CONTROLLER_ERROR:
                return api_error('error_connect_controller')
            return api_error('error_connect_failed', error=ret.errmsg)"""

text = text.replace(connect_block_old, connect_block_new)

# Recipe save with reassignment
text = text.replace(
    """            return JSONResponse({
                'message': f'配方保存成功，配方ID已从 {original_id} 重新分配为 {recipe_id}',
                'id_reassigned': True,
                'original_id': int(original_id),
                'new_id': int(recipe_id)
            }, 200)""",
    """            return api_success(
                'success_recipe_saved_reassigned',
                original_id=int(original_id),
                recipe_id=int(recipe_id),
                extra={
                    'id_reassigned': True,
                    'original_id': int(original_id),
                    'new_id': int(recipe_id),
                },
            )""",
)

# Export success
text = text.replace(
    """        return JSONResponse({
            'message': f"成功导出 {exported_count} 个配方到U盘 ({current_time})",
            'timestamp': current_time,
            'backup_path': current_time,
            # 'unmount_success': unmount_success
        }, 200)""",
    """        return api_success(
            'success_export_recipes_with_time',
            count=exported_count,
            time=current_time,
            extra={
                'timestamp': current_time,
                'backup_path': current_time,
            },
        )""",
)

# Import result
text = text.replace(
    """        result_msg = f"成功导入 {imported_count} 个配方"
        if skipped_count > 0:
            result_msg += f"，跳过 {skipped_count} 个重名配方"
        if id_reassigned_count > 0:
            result_msg += f"，{id_reassigned_count} 个配方重新分配了配方号"
        if error_list:
            result_msg += f"，{len(error_list)} 个配方导入失败"

        return JSONResponse({
            'message': result_msg,
            'imported_count': imported_count,
            'skipped_count': skipped_count,
            'id_reassigned_count': id_reassigned_count,
            'error_count': len(error_list),
            'errors': error_list,
            'reassigned_list': reassigned_list,
            # 'unmount_success': unmount_success
        }, 200)""",
    """        return api_success(
            'success_import_result',
            imported_count=imported_count,
            skipped_count=skipped_count,
            id_reassigned_count=id_reassigned_count,
            error_count=len(error_list),
            extra={
                'imported_count': imported_count,
                'skipped_count': skipped_count,
                'id_reassigned_count': id_reassigned_count,
                'error_count': len(error_list),
                'errors': error_list,
                'reassigned_list': reassigned_list,
            },
        )""",
)

# get_robot_ip message
text = text.replace(
    """            return JSONResponse({
                'success': False,
                'robot_ip': None,
                'message': '无法获取机器人IP地址'
            }, 200)""",
    """            return JSONResponse({
                'success': False,
                'robot_ip': None,
                'message_code': 'error_cannot_get_robot_ip',
            }, 200)""",
)

text = text.replace(
    """        return JSONResponse({
            'success': False,
            'robot_ip': None,
            'error': str(e)
        }, 400)""",
    """        return JSONResponse({
            'success': False,
            'robot_ip': None,
            'error_code': 'error_internal',
            'params': {'detail': str(e)},
        }, 400)""",
)

APP.write_text(text, encoding='utf-8')
remaining = len(re.findall(r"\{'error':", text))
print(f'Migration done. Remaining literal error responses: {remaining}')
