#转译命令
#先pnpm i
#然后再pnpm build
#插件包版本如果更新需要pnpm copy
#打包命令
#pyinstaller --onefile --add-data "templates;templates" --add-data "static;static" -i C:\Users\Phoenix\Documents\AUTOPLAN\AUTOPLAN_V3.3\static\favicon.ico --name 启动系统 app.py
#安装依赖
#pip install fastapi[standard]

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import matplotlib
matplotlib.use('Agg')  # 设置为非交互式后端
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, Polygon
import io
import math
import os
import json
import platform
import subprocess
import shutil
from typing import Optional
from Agilebot.IR.A.arm import Arm
from Agilebot.IR.A.status_code import StatusCodeEnum
from Agilebot.IR.A.sdk_types import CoordinateSystemType, SignalType, SignalValue
from Agilebot.IR.A.sdk_classes import PoseRegister, Posture, PoseType
from Agilebot.IR.A.extension import Extension

# 获取插件端口号，无未提供，默认5000
PORT = os.getenv("PORT", "5000")

app = FastAPI()
app.mount("/static", StaticFiles(directory="static", follow_symlink=True), name="static")
templates = Jinja2Templates(directory="templates")

robot_arm: Optional[Arm] = None
def calculate_bounding_box(vertices):
    """计算给定顶点的最小外接矩形"""
    x_cords = [v[0] for v in vertices]
    y_cords = [v[1] for v in vertices]
    min_x, max_x = min(x_cords), max(x_cords)
    min_y, max_y = min(y_cords), max(y_cords)
    return min_x, min_y, max_x - min_x, max_y - min_y

def calculate_shape_centers(frame_length, frame_width, shape_length, shape_width, horizontal_spacing, vertical_spacing, horizontal_border_distance, vertical_border_distance,
                            is_circle=False, is_rectangle=False, polygon_sides=None, is_triangle=False, triangle_type=None, triangle_orientation=None, is_honeycomb=False, place_type='row', polygon_arrangement='diagonal'):
    """计算给定框内可填充的指定形状的中心位置及数量"""
    try:
        if is_circle:
            diameter = shape_length
            # 使用横向边框距离计算有效行长度
            effective_row_length = frame_length - 2 * horizontal_border_distance
            # 使用纵向边框距离计算有效列宽度
            effective_column_width = frame_width - 2 * vertical_border_distance

            if is_honeycomb:
                # 蜂窝式排布
                circles_per_row = math.floor((effective_row_length - diameter) / (diameter + horizontal_spacing))
                if effective_row_length - (circles_per_row * (diameter + horizontal_spacing) + diameter) >= 0:
                    circles_per_row += 1

                circles_per_column = math.floor((effective_column_width - diameter) / (diameter * math.sqrt(3) / 2 + vertical_spacing))
                if effective_column_width - (circles_per_column * (diameter * math.sqrt(3) / 2 + vertical_spacing) + diameter) >= 0:
                    circles_per_column += 1

                total_shapes = 0
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = circles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(circles_per_column):
                        for col in range(circles_per_row):
                            x_center = round(horizontal_border_distance + diameter / 2 + col * (diameter + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + diameter / 2 + row * (diameter * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (diameter + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + diameter / 2 <= frame_length - horizontal_border_distance and y_center + diameter / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1
                else:
                    shapes_per_row_or_col = circles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(circles_per_row):
                        for row in range(circles_per_column):
                            x_center = round(horizontal_border_distance + diameter / 2 + col * (diameter + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + diameter / 2 + row * (diameter * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (diameter + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + diameter / 2 <= frame_length - horizontal_border_distance and y_center + diameter / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1

            else:
                # 阵列式排布
                circles_per_row = math.floor((effective_row_length - diameter) / (diameter + horizontal_spacing))
                if effective_row_length - (circles_per_row * (diameter + horizontal_spacing) + diameter) >= 0:
                    circles_per_row += 1

                circles_per_column = math.floor((effective_column_width - diameter) / (diameter + vertical_spacing))
                if effective_column_width - (circles_per_column * (diameter + vertical_spacing) + diameter) >= 0:
                    circles_per_column += 1

                total_shapes = circles_per_row * circles_per_column

                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = circles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(circles_per_column):
                        for col in range(circles_per_row):
                            x_center = round(horizontal_border_distance + diameter / 2 + col * (diameter + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + diameter / 2 + row * (diameter + vertical_spacing), 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号

                else:
                    shapes_per_row_or_col = circles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(circles_per_row):
                        for row in range(circles_per_column):
                            x_center = round(horizontal_border_distance + diameter / 2 + col * (diameter + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + diameter / 2 + row * (diameter + vertical_spacing), 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号

        elif is_rectangle:
            effective_row_length = frame_length - 2 * horizontal_border_distance
            effective_column_width = frame_width - 2 * vertical_border_distance

            if is_honeycomb:
                # 蜂窝式排布
                rectangles_per_row = math.floor((effective_row_length - shape_length) / (shape_length + horizontal_spacing))
                if effective_row_length - (rectangles_per_row * (shape_length + horizontal_spacing) + shape_length) >= 0:
                    rectangles_per_row += 1

                rectangles_per_column = math.floor((effective_column_width - shape_width) / (shape_width * math.sqrt(3) / 2 + vertical_spacing))
                if effective_column_width - (rectangles_per_column * (shape_width * math.sqrt(3) / 2 + vertical_spacing) + shape_width) >= 0:
                    rectangles_per_column += 1

                total_shapes = 0
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = rectangles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(rectangles_per_column):
                        for col in range(rectangles_per_row):
                            x_center = round(horizontal_border_distance + shape_length / 2 + col * (shape_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + shape_width / 2 + row * (shape_width * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (shape_length + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + shape_length / 2 <= frame_length - horizontal_border_distance and y_center + shape_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1
                else:
                    shapes_per_row_or_col = rectangles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(rectangles_per_row):
                        for row in range(rectangles_per_column):
                            x_center = round(horizontal_border_distance + shape_length / 2 + col * (shape_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + shape_width / 2 + row * (shape_width * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (shape_length + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + shape_length / 2 <= frame_length - horizontal_border_distance and y_center + shape_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1

            else:
                # 阵列式排布
                rectangles_per_row = math.floor((effective_row_length - shape_length) / (shape_length + horizontal_spacing))
                if effective_row_length - (rectangles_per_row * (shape_length + horizontal_spacing) + shape_length) >= 0:
                    rectangles_per_row += 1

                rectangles_per_column = math.floor((effective_column_width - shape_width) / (shape_width + vertical_spacing))
                if effective_column_width - (rectangles_per_column * (shape_width + vertical_spacing) + shape_width) >= 0:
                    rectangles_per_column += 1

                total_shapes = rectangles_per_row * rectangles_per_column

                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = rectangles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(rectangles_per_column):
                        for col in range(rectangles_per_row):
                            x_center = round(horizontal_border_distance + shape_length / 2 + col * (shape_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + shape_width / 2 + row * (shape_width + vertical_spacing), 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                else:
                    shapes_per_row_or_col = rectangles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(rectangles_per_row):
                        for row in range(rectangles_per_column):
                            x_center = round(horizontal_border_distance + shape_length / 2 + col * (shape_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + shape_width / 2 + row * (shape_width + vertical_spacing), 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号

        elif polygon_sides is not None and 4 < polygon_sides <= 8:
            # 假设多边形为正多边形，以边长表示形状大小
            circumradius = shape_length / (2 * math.sin(math.pi / polygon_sides))
            inradius = shape_length / (2 * math.tan(math.pi / polygon_sides))  # 计算内切圆半径

            # 计算一个示例多边形的顶点
            example_center = (0, 0)
            vertices = []
            for i in range(polygon_sides):
                x = example_center[0] + circumradius * math.cos(i * math.pi * 2 / polygon_sides)
                y = example_center[1] + circumradius * math.sin(i * math.pi * 2 / polygon_sides)
                vertices.append((x, y))

            # 计算最小外接矩形
            min_x, min_y, bounding_box_length, bounding_box_width = calculate_bounding_box(vertices)

            effective_row_length = frame_length - 2 * horizontal_border_distance
            effective_column_width = frame_width - 2 * vertical_border_distance

            if is_honeycomb:
                # 蜂窝式排布
                if polygon_sides == 6:
                    if polygon_arrangement == 'diagonal':
                        # 对角排布：使用外接圆直径
                        center_distance = 2 * circumradius + horizontal_spacing
                        vertical_distance = math.sqrt(3) * circumradius + vertical_spacing
                    else:  # edge
                        # 对边排布：使用内切圆直径
                        center_distance = 2 * inradius + horizontal_spacing
                        vertical_distance = math.sqrt(3) * inradius + vertical_spacing
                else:
                    center_distance = bounding_box_length + horizontal_spacing
                    vertical_distance = bounding_box_width + vertical_spacing

                polygons_per_row = math.floor((effective_row_length - bounding_box_length) / center_distance)
                if effective_row_length - (polygons_per_row * center_distance + bounding_box_length) >= 0:
                    polygons_per_row += 1

                polygons_per_column = math.floor((effective_column_width - bounding_box_width) / vertical_distance)
                if effective_column_width - (polygons_per_column * vertical_distance + bounding_box_width) >= 0:
                    polygons_per_column += 1

                total_shapes = 0
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = polygons_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(polygons_per_column):
                        for col in range(polygons_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * center_distance, 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * vertical_distance, 2)
                            if row % 2 == 1:
                                x_center = round(x_center + center_distance / 2, 2)

                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1
                else:
                    shapes_per_row_or_col = polygons_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(polygons_per_row):
                        for row in range(polygons_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * center_distance, 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * vertical_distance, 2)
                            if row % 2 == 1:
                                x_center = round(x_center + center_distance / 2, 2)

                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1

            else:
                # 阵列式排布
                if polygon_sides == 6:
                    if polygon_arrangement == 'diagonal':
                        # 对角排布：使用外接圆直径
                        center_distance = 2 * circumradius + horizontal_spacing
                        vertical_distance = 2 * circumradius + vertical_spacing
                    else:  # edge
                        # 对边排布：使用内切圆直径
                        center_distance = 2 * inradius + horizontal_spacing
                        vertical_distance = 2 * inradius + vertical_spacing
                else:
                    center_distance = bounding_box_length + horizontal_spacing
                    vertical_distance = bounding_box_width + vertical_spacing

                polygons_per_row = math.floor((effective_row_length - bounding_box_length) / center_distance)
                if effective_row_length - (polygons_per_row * center_distance + bounding_box_length) >= 0:
                    polygons_per_row += 1

                polygons_per_column = math.floor((effective_column_width - bounding_box_width) / vertical_distance)
                if effective_column_width - (polygons_per_column * vertical_distance + bounding_box_width) >= 0:
                    polygons_per_column += 1

                total_shapes = polygons_per_row * polygons_per_column

                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = polygons_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(polygons_per_column):
                        for col in range(polygons_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * center_distance, 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * vertical_distance, 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                else:
                    shapes_per_row_or_col = polygons_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(polygons_per_row):
                        for row in range(polygons_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * center_distance, 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * vertical_distance, 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号

        elif is_triangle:
            effective_row_length = frame_length - 2 * horizontal_border_distance
            effective_column_width = frame_width - 2 * vertical_border_distance

            # 计算等腰三角形的高
            if triangle_type == 'isosceles':
                height = math.sqrt(shape_length ** 2 - (shape_width / 2) ** 2)
            elif triangle_type == 'equilateral':
                height = math.sqrt(3) / 2 * shape_length
            else:
                raise ValueError("无效的三角形类型")

            # 计算一个示例三角形的顶点
            example_center = (0, 0)
            if triangle_type == "equilateral":
                if triangle_orientation == "up":
                    vertices = [
                        (example_center[0], example_center[1] + height / 3),
                        (example_center[0] - shape_length / 2, example_center[1] - height / 3),
                        (example_center[0] + shape_length / 2, example_center[1] - height / 3)
                    ]

                elif triangle_orientation == "down":
                    vertices = [
                        (example_center[0], example_center[1] - height / 3),
                        (example_center[0] - shape_length / 2, example_center[1] + height / 3),
                        (example_center[0] + shape_length / 2, example_center[1] + height / 3)
                    ]

                elif triangle_orientation == "left":
                    vertices = [
                        (example_center[0] - height / 3, example_center[1]),
                        (example_center[0] + height / 3, example_center[1] - shape_length / 2),
                        (example_center[0] + height / 3, example_center[1] + shape_length / 2)
                    ]

                elif triangle_orientation == "right":
                    vertices = [
                        (example_center[0] + height / 3, example_center[1]),
                        (example_center[0] - height / 3, example_center[1] - shape_length / 2),
                        (example_center[0] - height / 3, example_center[1] + shape_length / 2)
                    ]

                else:
                    raise ValueError("无效的三角形朝向")

            elif triangle_type == "isosceles":
                if triangle_orientation == "up":
                    vertices = [
                        (example_center[0], example_center[1] + height / 2),
                        (example_center[0] - shape_width / 2, example_center[1] - height / 2),
                        (example_center[0] + shape_width / 2, example_center[1] - height / 2)
                    ]

                elif triangle_orientation == "down":
                    vertices = [
                        (example_center[0], example_center[1] - height / 2),
                        (example_center[0] - shape_width / 2, example_center[1] + height / 2),
                        (example_center[0] + shape_width / 2, example_center[1] + height / 2)
                    ]

                elif triangle_orientation == "left":
                    vertices = [
                        (example_center[0] - height / 2, example_center[1]),
                        (example_center[0] + height / 2, example_center[1] - shape_width / 2),
                        (example_center[0] + height / 2, example_center[1] + shape_width / 2)
                    ]

                elif triangle_orientation == "right":
                    vertices = [
                        (example_center[0] + height / 2, example_center[1]),
                        (example_center[0] - height / 2, example_center[1] - shape_width / 2),
                        (example_center[0] - height / 2, example_center[1] + shape_width / 2)
                    ]

                else:
                    raise ValueError("无效的三角形朝向")

            # 计算最小外接矩形
            min_x, min_y, bounding_box_length, bounding_box_width = calculate_bounding_box(vertices)

            if is_honeycomb:
                # 蜂窝式排布
                triangles_per_row = math.floor((effective_row_length - bounding_box_length) / (bounding_box_length + horizontal_spacing))
                if effective_row_length - (triangles_per_row * (bounding_box_length + horizontal_spacing) + bounding_box_length) >= 0:
                    triangles_per_row += 1

                triangles_per_column = math.floor((effective_column_width - bounding_box_width) / (height + vertical_spacing))
                if effective_column_width - (triangles_per_column * (height + vertical_spacing) + bounding_box_width) >= 0:
                    triangles_per_column += 1

                total_shapes = 0
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = triangles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(triangles_per_column):
                        for col in range(triangles_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (height + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (bounding_box_length + horizontal_spacing) / 2, 2)
                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                # 只返回坐标信息 (x, y)
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1
                else:
                    shapes_per_row_or_col = triangles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(triangles_per_row):
                        for row in range(triangles_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (height + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (bounding_box_length + horizontal_spacing) / 2, 2)
                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                # 只返回坐标信息 (x, y)
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1

            else:
                # 阵列式排布
                triangles_per_row = math.floor((effective_row_length - bounding_box_length) / (bounding_box_length + horizontal_spacing))
                if effective_row_length - (triangles_per_row * (bounding_box_length + horizontal_spacing) + bounding_box_length) >= 0:
                    triangles_per_row += 1

                triangles_per_column = math.floor((effective_column_width - bounding_box_width) / (bounding_box_width + vertical_spacing))
                if effective_column_width - (triangles_per_column * (bounding_box_width + vertical_spacing) + bounding_box_width) >= 0:
                    triangles_per_column += 1

                total_shapes = triangles_per_row * triangles_per_column
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = triangles_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(triangles_per_column):
                        for col in range(triangles_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width + vertical_spacing), 2)
                            # 只返回坐标信息 (x, y)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                            total_shapes += 1
                else:
                    shapes_per_row_or_col = triangles_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(triangles_per_row):
                        for row in range(triangles_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width + vertical_spacing), 2)
                            # 只返回坐标信息 (x, y)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                            total_shapes += 1

        return total_shapes, shape_centers, shapes_per_row_or_col, row_col_info

    except Exception as e:
        raise ValueError(f"无法计算填充数量，错误信息：{e}")
@app.get('/')
def index(request: Request):
    """渲染前端页面"""

    # 读取版本号
    with open('config.json', 'r') as f:
        config = json.load(f)
    version = config['version']
    is_tp = platform.system().lower() == 'linux'

    return templates.TemplateResponse(
        request=request, name="index.html",
        context={
            'version': version,
            'is_tp': is_tp
        }
    )

@app.post('/calculate')
async def calculate(request: Request):
    """接收前端请求，计算并返回结果"""
    data = await request.json()
    try:
        # 检查必需字段是否存在
        required_fields = [
            'frame_length', 'frame_width', 'shape_length', 'horizontal_spacing',
            'vertical_spacing', 'horizontal_border_distance','vertical_border_distance', 'shape_type', 'layout_type', 'place_type',
        ]
        for field in required_fields:
            if field not in data:
                return JSONResponse({'error': f'缺少必需字段: {field}'}, 400)

        frame_length = float(data['frame_length'])
        frame_width = float(data['frame_width'])
        shape_length = float(data['shape_length'])
        horizontal_spacing = float(data['horizontal_spacing'])
        vertical_spacing = float(data['vertical_spacing'])
        horizontal_border_distance = float(data['horizontal_border_distance'])
        vertical_border_distance = float(data['vertical_border_distance'])
        shape_type = data['shape_type']
        layout_type = data['layout_type']
        polygon_sides = int(data['polygon_sides']) if shape_type == 'polygon' else None
        triangle_type = data['triangle_type'] if shape_type == 'triangle' else None
        triangle_orientation = data['triangle_orientation'] if shape_type == 'triangle' else None
        place_type = data.get('place_type', 'row')  # 默认值为 'row'
        remainder_turn = data.get('remainder_turn', 'off')  # 默认值为 'off'
        polygon_arrangement = data.get('polygon_arrangement', 'diagonal')  # 默认值为 'diagonal'

        # 处理 shape_width
        shape_width = data.get('shape_width', '')  # 获取 shape_width，默认为空字符串
        if shape_width == '':
            if shape_type == 'triangle' and triangle_type == 'equilateral':
                shape_width = shape_length  # 等边三角形的底边长等于边长
            else:
                return JSONResponse({'error': 'shape_width 不能为空'}, 400)
        else:
            shape_width = float(shape_width)

        # 计算图形填充
        total_shapes, shape_centers, shapes_per_row_or_col, row_col_info = calculate_shape_centers(
            frame_length, frame_width, shape_length, shape_width,
            horizontal_spacing, vertical_spacing, horizontal_border_distance,vertical_border_distance,
            is_circle=shape_type == 'circle',
            is_rectangle=shape_type == 'rectangle',
            polygon_sides=polygon_sides,
            is_triangle=shape_type == 'triangle',
            triangle_type=triangle_type,
            triangle_orientation=triangle_orientation,
            is_honeycomb=layout_type == 'honeycomb',
            place_type = place_type,
            polygon_arrangement = polygon_arrangement
        )

        # 使用 matplotlib 绘制图形
        fig, ax = plt.subplots()
        ax.set_xlim([0, frame_length])
        ax.set_ylim([0, frame_width])
        ax.plot([0, frame_length, frame_length, 0, 0], [0, 0, frame_width, frame_width, 0], 'k-')

        if shape_type == 'circle':
            for center in shape_centers:
                circle = Circle(center, shape_length / 2, fill=True)
                ax.add_patch(circle)
        elif shape_type == 'rectangle':
            for center in shape_centers:
                rectangle = Rectangle((center[0] - shape_length / 2, center[1] - shape_width / 2), shape_length, shape_width, fill=True)
                ax.add_patch(rectangle)
        elif shape_type == 'polygon':
            circumradius = shape_length / (2 * math.sin(math.pi / polygon_sides))
            for center in shape_centers:
                vertices = []
                # 计算六边形的旋转角度
                if polygon_sides == 6:
                    if polygon_arrangement == 'diagonal':
                        # 角对角排布时，顶点朝上
                        start_angle = 0
                    else:  # edge
                        # 边对边排布时，边朝上
                        start_angle = math.pi / 6  # 30度
                else:
                    start_angle = 0

                for i in range(polygon_sides):
                    angle = start_angle + i * math.pi * 2 / polygon_sides
                    x = center[0] + circumradius * math.cos(angle)
                    y = center[1] + circumradius * math.sin(angle)
                    vertices.append((x, y))
                polygon = Polygon(vertices, fill=True)
                ax.add_patch(polygon)

                # 计算最小外接矩形
                min_x, min_y, bounding_box_length, bounding_box_width = calculate_bounding_box(vertices)

                # 绘制外接矩形轮廓
                bounding_box = Rectangle((center[0] - bounding_box_length / 2, center[1] - bounding_box_width / 2),
                                         bounding_box_length, bounding_box_width, fill=False, edgecolor='red',
                                         linestyle='--')
                ax.add_patch(bounding_box)

        elif shape_type == 'triangle':
            for center in shape_centers:
                x_center, y_center = center
                if triangle_type == "equilateral":
                    height = math.sqrt(3) / 2 * shape_length
                    if triangle_orientation == "up":
                        vertices = [
                            (x_center, y_center + height / 3),
                            (x_center - shape_length / 2, y_center - height / 3),
                            (x_center + shape_length / 2, y_center - height / 3)
                        ]
                    elif triangle_orientation == "down":
                        vertices = [
                            (x_center, y_center - height / 3),
                            (x_center - shape_length / 2, y_center + height / 3),
                            (x_center + shape_length / 2, y_center + height / 3)
                        ]
                    elif triangle_orientation == "left":
                        vertices = [
                            (x_center - height / 3, y_center),
                            (x_center + height / 3, y_center - shape_length / 2),
                            (x_center + height / 3, y_center + shape_length / 2)
                        ]
                    elif triangle_orientation == "right":
                        vertices = [
                            (x_center + height / 3, y_center),
                            (x_center - height / 3, y_center - shape_length / 2),
                            (x_center - height / 3, y_center + shape_length / 2)
                        ]
                    else:
                        raise ValueError("无效的三角形朝向")
                elif triangle_type == "isosceles":
                    height = math.sqrt(shape_length ** 2 - (shape_width / 2) ** 2)
                    if triangle_orientation == "up":
                        vertices = [
                            (x_center, y_center + height / 2),
                            (x_center - shape_width / 2, y_center - height / 2),
                            (x_center + shape_width / 2, y_center - height / 2)
                        ]
                    elif triangle_orientation == "down":
                        vertices = [
                            (x_center, y_center - height / 2),
                            (x_center - shape_width / 2, y_center + height / 2),
                            (x_center + shape_width / 2, y_center + height / 2)
                        ]
                    elif triangle_orientation == "left":
                        vertices = [
                            (x_center - height / 2, y_center),
                            (x_center + height / 2, y_center - shape_width / 2),
                            (x_center + height / 2, y_center + shape_width / 2)
                        ]
                    elif triangle_orientation == "right":
                        vertices = [
                            (x_center + height / 2, y_center),
                            (x_center - height / 2, y_center - shape_width / 2),
                            (x_center - height / 2, y_center + shape_width / 2)
                        ]
                    else:
                        raise ValueError("无效的三角形朝向")

                triangle = Polygon(vertices, fill=True)
                ax.add_patch(triangle)

                # 计算最小外接矩形
                min_x, min_y, bounding_box_length, bounding_box_width = calculate_bounding_box(vertices)

                # 绘制外接矩形轮廓
                bounding_box = Rectangle((center[0] - bounding_box_length / 2, center[1] - bounding_box_width / 2),
                                         bounding_box_length, bounding_box_width, fill=False, edgecolor='red',
                                         linestyle='--')
                ax.add_patch(bounding_box)

        # 计算行数和列数
        rows = max([row for row, col in row_col_info]) if row_col_info else 0
        cols = max([col for row, col in row_col_info]) if row_col_info else 0

        # 将图像保存为字节流
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)

        # 返回图像文件和填充图形数量
        headers = {}
        headers['X-Total-Shapes'] = str(total_shapes)
        headers['X-Shape-Centers'] = json.dumps(shape_centers)
        headers['X-Shapes-Per-Row-Or-Col'] = str(shapes_per_row_or_col)  # 返回单行/列填充数量
        headers['X-Row-Col-Info'] = json.dumps(row_col_info)  # 返回行号和列号信息
        headers['X-Rows'] = str(rows)  # 返回行数
        headers['X-Cols'] = str(cols)  # 返回列数
        headers['X-Remainder-Turn'] = remainder_turn  # 返回余行列转向选项
        return StreamingResponse(
            buf,
            media_type="image/png",
            headers=headers
        )

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/connect_robot')
async def connect_robot(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    robot_ip = data.get('robot_ip')

    if not robot_ip:
        return JSONResponse({'error': '缺少机器人IP地址'}, 400)

    try:
        # 如果IP地址是970215，模拟连接成功
        if robot_ip == '970215':
            return JSONResponse({
                'model_info': '模拟机器人型号',
                'controller_version': '模拟控制柜版本'
            }, 200)

        # 如果已经连接，先断开
        if robot_arm is not None:
            robot_arm.disconnect()
            robot_arm = None

        # 初始化 Arm 类并连接
        robot_arm = Arm()
        ret = robot_arm.connect(robot_ip)
        if ret != StatusCodeEnum.OK:
            # 根据状态码返回具体的错误信息
            if ret == StatusCodeEnum.INVALID_IP_ADDRESS:
                error_msg = '连接失败: IP 地址无效'
            elif ret == StatusCodeEnum.CONNECTION_TIMEOUT:
                error_msg = '连接失败: 连接超时'
            elif ret == StatusCodeEnum.CONTROLLER_ERROR:
                error_msg = '连接失败: 控制器错误，详情请联系开发人员'
            else:
                error_msg = f'连接失败: {ret.errmsg}'

            # 清理连接状态
            robot_arm = None
            return JSONResponse({'error': error_msg}, 400)

        # 获取型号
        model_info, ret = robot_arm.get_arm_model_info()
        if ret != StatusCodeEnum.OK:
            # 获取型号失败时，清理连接状态
            robot_arm.disconnect()
            robot_arm = None
            return JSONResponse({'error': '获取型号失败: ' + ret.errmsg}, 400)

        # 获取控制柜版本 - 使用新版本SDK的接口
        version_info, ret = robot_arm.get_version()
        if ret != StatusCodeEnum.OK:
            # 获取版本失败时，清理连接状态
            robot_arm.disconnect()
            robot_arm = None
            return JSONResponse({'error': '获取控制柜版本失败: ' + ret.errmsg}, 400)

        # 返回型号和控制柜版本信息，保持连接状态
        return JSONResponse({
            'model_info': model_info,
            'controller_version': version_info
        }, 200)

    except Exception as e:
        # 发生异常时，清理连接状态
        if robot_arm is not None:
            robot_arm.disconnect()
            robot_arm = None
        return JSONResponse({'error': str(e)}, 400)

@app.post('/disconnect_robot')
async def disconnect_robot_route(request: Request):
    global robot_arm
    if robot_arm is not None:
        robot_arm.disconnect()
        robot_arm = None
        return JSONResponse({'message': '已断开连接'}, 200)
    else:
        return JSONResponse({'error': '未连接机器人'}, 400)


@app.post('/get_p_data')
async def get_p_data(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    program_name = data.get('program_name')

    if not program_name:
        return JSONResponse({'error': '缺少程序名称'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取所有位姿
        assert robot_arm is not None  # 类型检查器断言
        poses, ret = robot_arm.program_pose.read_all_poses(program_name)
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取P点数据失败'}, 400)

        # 将位姿数据转换为JSON格式
        poses_data = []
        for p in poses:
            poses_data.append({
                'id': p.id,
                'name': p.name,
                'poseData': {
                    'cartData': {
                        'baseCart': {
                            'posture': {
                                'arm_left_right': p.poseData.cartData.baseCart.posture.arm_left_right  # 直接返回坐标系方向值
                            },
                            'position': {
                                'x': p.poseData.cartData.baseCart.position.x,
                                'y': p.poseData.cartData.baseCart.position.y,
                                'z': p.poseData.cartData.baseCart.position.z,
                                'c': p.poseData.cartData.baseCart.position.c,
                            },
                        },
                        'uf': p.poseData.cartData.uf,  # 直接返回UF值
                        'tf': p.poseData.cartData.tf,  # 直接返回TF值
                    }
                }
            })

        return JSONResponse({'poses': poses_data}, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/write_p_data')
async def write_p_data(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    program_name = data.get('program_name')
    p_data = data.get('p_data')

    if not program_name or not p_data:
        return JSONResponse({'error': '缺少程序名称或P点数据'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 检查机器人状态
        state, ret = robot_arm.get_robot_status()
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '获取机器人状态失败'}, 400)

        # 检查机器人是否处于空闲状态
        if state.msg != "机器人空闲":
            return JSONResponse({'error': '机器人当前不处于空闲状态，无法写入P点'}, 400)

        # 批量写入P点数据
        for p in p_data:
            pose_id = p['id']
            x = float(p['x'])  # 确保X是浮点数
            y = float(p['y'])  # 确保Y是浮点数
            z = float(p['z'])  # 确保Z是浮点数
            c = float(p['c'])  # 确保C是浮点数
            uf = int(p.get('uf', 1))  # 确保UF是整数
            tf = int(p.get('tf', 1))  # 确保TF是整数
            left_right = int(p.get('left_right', 1))  # 确保坐标系方向是整数

            # 读取当前P点的位姿数据
            if robot_arm is None:
                return JSONResponse({'error': '机器人连接已断开'}, 400)
            assert robot_arm is not None  # 类型检查器断言
            pose, ret = robot_arm.program_pose.read(program_name, pose_id)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'读取P点 {pose_id} 数据失败'}, 400)

            # 修改位姿数据的X、Y、Z、C坐标，并更新UF和TF值
            pose.poseData.cartData.baseCart.position.x = x
            pose.poseData.cartData.baseCart.position.y = y
            pose.poseData.cartData.baseCart.position.z = z
            pose.poseData.cartData.baseCart.position.c = c
            pose.poseData.cartData.uf = uf  # 更新UF值
            pose.poseData.cartData.tf = tf  # 更新TF值
            pose.poseData.cartData.baseCart.posture.arm_left_right = left_right  # 更新坐标系方向值

            # 将修改后的位姿数据写回
            if robot_arm is None:
                return JSONResponse({'error': '机器人连接已断开'}, 400)
            ret = robot_arm.program_pose.write(program_name, pose_id, pose)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'写入P点 {pose_id} 数据失败'}, 400)

        return JSONResponse({'message': 'P点数据写入成功'}, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/read_pr_register')
async def read_pr_register(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    pr_register_id = data.get('pr_register_id')
    print(f"读取PR寄存器 {pr_register_id} 的C值")  # 打印调试信息

    if pr_register_id is None:
        return JSONResponse({'error': '缺少PR寄存器ID'}, 400)

    try:
        pr_register_id = int(pr_register_id)  # 确保PR寄存器ID是整数
    except ValueError:
        return JSONResponse({'error': 'PR寄存器ID必须是整数'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取位姿寄存器 - 使用新版本SDK的接口
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        assert robot_arm is not None  # 类型检查器断言
        pose_register, ret = robot_arm.register.read_PR(pr_register_id)
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取PR寄存器失败'}, 400)

        # 打印调试信息
        print(f"PR寄存器 {pr_register_id} 的Z值: {pose_register.poseRegisterData.cartData.position.z}")
        print(f"PR寄存器 {pr_register_id} 的C值: {pose_register.poseRegisterData.cartData.position.c}")

        # 返回Z和C的值
        return JSONResponse({
            'z': pose_register.poseRegisterData.cartData.position.z,
            'c': pose_register.poseRegisterData.cartData.position.c
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 新增：写入R寄存器的路由
@app.post('/write_r_registers')
async def write_r_registers(request: Request):
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    # 获取前端传入的值
    frame_length = data.get('frame_length')
    frame_width = data.get('frame_width')
    frame_depth = data.get('frame_depth')
    shape_height = data.get('shape_height')
    material_thickness = data.get('material_thickness')
    placement_layers = data.get('placement_layers')
    total_shapes = data.get('total_shapes')
    tool_count = data.get('tool_count')
    drop_Count = data.get('drop_Count')
    numofsingle_row_columns = data.get('numofsingle_row_columns')
    rows = data.get('rows')  # 获取行数
    cols = data.get('cols')  # 获取列数

    # 检查机器人是否已连接
    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:

        # 写入R1寄存器（图形高度）- 使用新版本SDK的接口
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        assert robot_arm is not None  # 类型检查器断言
        ret = robot_arm.register.write_R(1, float(shape_height))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R1寄存器失败'}, 400)

        # 写入R2寄存器（包材厚度）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        assert robot_arm is not None  # 类型检查器断言
        ret = robot_arm.register.write_R(2, float(material_thickness))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R2寄存器失败'}, 400)

        # 写入R3寄存器（摆放层数）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(3, int(placement_layers))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R3寄存器失败'}, 400)

         # 写入R4寄存器（填充数量）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(4, int(total_shapes))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R4寄存器失败'}, 400)

        # 写入R5寄存器（工具数量）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(5, int(tool_count))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R5寄存器失败'}, 400)

        # 写入R6寄存器（边框深度）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(6, float(frame_depth))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R6寄存器失败'}, 400)

        # 写入R7寄存器（料框长度）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(7, int(frame_length))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R7寄存器失败'}, 400)

        # 写入R8寄存器（料框宽度）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(8, int(frame_width))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R8寄存器失败'}, 400)

        # 写入R9寄存器（前端下料数量）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(9, int(drop_Count))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R9寄存器失败'}, 400)

         # 写入R10寄存器（单行列数量）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(10, int(numofsingle_row_columns))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R10寄存器失败'}, 400)

        # 写入R11寄存器（行数）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(11, int(rows))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R11寄存器失败'}, 400)

         # 写入R12寄存器（列数）
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        ret = robot_arm.register.write_R(12, int(cols))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '写入R12寄存器失败'}, 400)

        return JSONResponse({'message': 'R寄存器写入成功'}, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/get_tf_data')
async def get_tf_data(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    tf_id = data.get('tf_id')

    if tf_id is None:
        return JSONResponse({'error': '缺少TF ID'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取指定TF的值
        tf, ret = robot_arm.coordinate_system.get(CoordinateSystemType.ToolFrame, tf_id)
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取TF数据失败'}, 400)

        print(
            f"TF序号：{tf.coordinate_info.coordinate_id}\n"
            f"TF名称：{tf.coordinate_info.name}\n"
            f"X：{tf.position.x}\n"
            f"Y：{tf.position.y}\n"
            f"Z：{tf.position.z}\n"
            f"A：{tf.orientation.r}\n"
            f"B：{tf.orientation.p}\n"
            f"C：{tf.orientation.y}\n"
        )

        # 返回TF数据
        return JSONResponse({
            'tf': {
                'coordinate_info': {
                    'coordinate_id': tf.coordinate_info.coordinate_id,
                    'name': tf.coordinate_info.name,
                    'group_id': tf.coordinate_info.group_id
                },
                'position': {
                    'x': tf.position.x,
                    'y': tf.position.y,
                    'z': tf.position.z
                },
                'orientation': {
                    'r': tf.orientation.r,
                    'p': tf.orientation.p,
                    'y': tf.orientation.y
                }
            }
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/update_tf_data')
async def update_tf_data(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    tf_updates = data.get('tf_updates')

    if not tf_updates:
        return JSONResponse({'error': '缺少TF更新数据'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 批量更新TF数据
        for tf_update in tf_updates:
            tf_id = tf_update['coordinate_info']['coordinate_id']
            tf, ret = robot_arm.coordinate_system.get(CoordinateSystemType.ToolFrame, tf_id)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'读取TF {tf_id} 数据失败'}, 400)

            # 更新TF的值
            tf.coordinate_info.name = tf_update['coordinate_info']['name']
            tf.position.x = tf_update['position']['x']
            tf.position.y = tf_update['position']['y']
            tf.position.z = tf_update['position']['z']
            tf.orientation.r = tf_update['orientation']['r']
            tf.orientation.p = tf_update['orientation']['p']
            tf.orientation.y = tf_update['orientation']['y']

            # 调试输出，检查每个 TF 的更新内容
            print(
                f"TF序号：{tf.coordinate_info.coordinate_id}\n"
                f"TF名称：{tf.coordinate_info.name}\n"
                f"X：{tf.position.x}\n"
                f"Y：{tf.position.y}\n"
                f"Z：{tf.position.z}\n"
                f"A：{tf.orientation.r}\n"
                f"B：{tf.orientation.p}\n"
                f"C：{tf.orientation.y}\n"
            )

            # 将修改后的TF数据写回
            ret = robot_arm.coordinate_system.update(CoordinateSystemType.ToolFrame, tf)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'更新TF {tf_id} 数据失败'}, 400)

        return JSONResponse({'message': 'TF数据更新成功'}, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 仿形计算器
@app.post('/get_pr_data')
async def get_pr_data(request: Request):
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    shape_type = data.get('shape_type')
    diameter = data.get('diameter')
    length = data.get('length')
    width = data.get('width')

    if not shape_type:
        return JSONResponse({'error': '缺少仿形形状类型'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取PR寄存器的值 - 使用新版本SDK的接口
        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        pr1, ret1 = robot_arm.register.read_PR(1)
        if ret1 != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取PR1寄存器失败'}, 400)

        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        pr2, ret2 = robot_arm.register.read_PR(2)
        if ret2 != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取PR2寄存器失败'}, 400)

        if robot_arm is None:
            return JSONResponse({'error': '机器人连接已断开'}, 400)
        pr3, ret3 = robot_arm.register.read_PR(3)
        if ret3 != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取PR3寄存器失败'}, 400)

        # 获取PR寄存器的X和Y值
        pr1_x = pr1.poseRegisterData.cartData.position.x
        pr1_y = pr1.poseRegisterData.cartData.position.y
        pr2_x = pr2.poseRegisterData.cartData.position.x
        pr2_y = pr2.poseRegisterData.cartData.position.y
        pr3_x = pr3.poseRegisterData.cartData.position.x
        pr3_y = pr3.poseRegisterData.cartData.position.y

        # 调试输出，检查每个 TF 的更新内容
        print(
            f"pr1_x：{pr1_x}\n"
            f"pr1_y：{pr1_y}\n"
            f"pr2_x：{pr2_x}\n"
            f"pr2_y：{pr2_y}\n"
            f"pr3_x：{pr3_x}\n"
            f"pr3_y：{pr3_y}\n"
        )

        # 计算行间距和列间距
        if shape_type == 'circle':
            row_spacing = abs(pr3_y - pr1_y) - diameter
            col_spacing = abs(pr2_x - pr1_x) - diameter
            print(
                f"row_spacing：{row_spacing}\n"
                f"col_spacing：{col_spacing}\n"
            )
        elif shape_type == 'rectangle':
            row_spacing = abs(pr3_y - pr1_y) - width
            col_spacing = abs(pr2_x - pr1_x) - length
            print(
                f"row_spacing：{row_spacing}\n"
                f"col_spacing：{col_spacing}\n"
            )
        else:
            return JSONResponse({'error': '无效的仿形形状类型'}, 400)

        return JSONResponse({
            'row_spacing': row_spacing,
            'col_spacing': col_spacing,
            'pr1_x': pr1_x,
            'pr1_y': pr1_y,
            'pr2_x': pr2_x,
            'pr2_y': pr2_y,
            'pr3_x': pr3_x,
            'pr3_y': pr3_y
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/save_recipe')
async def save_recipe(request: Request):
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    try:
        # 获取配方名和配方编号
        recipe_name = data.get('recipeName')
        recipe_id = data.get('recipeId')  # 获取配方编号

        print(f"开始保存配方：名称={recipe_name}, ID={recipe_id} (类型: {type(recipe_id)})")

        if not recipe_name or not recipe_id:
            return JSONResponse({'error': '缺少配方名或配方编号'}, 400)

        # 检查ID冲突并自动分配新ID
        recipe_dir = 'data'
        if not os.path.exists(recipe_dir):
            os.makedirs(recipe_dir)

        used_ids = set()
        id_reassigned = False
        original_id = recipe_id
        id_conflict = False

        # 第一步：收集所有已使用的ID
        print(f"开始检查ID冲突，目标配方: {recipe_name}, 目标ID: {recipe_id}")
        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                existing_name, _ = os.path.splitext(f)  # 从文件名获取配方名
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    existing_recipe_data = json.load(file)
                    existing_id = existing_recipe_data.get('recipeId')

                    print(f"检查现有配方: {existing_name}, ID: {existing_id} (类型: {type(existing_id)})")

                    if existing_id is not None:
                        used_ids.add(int(existing_id))

                        # 检查ID冲突（排除同名配方的情况）
                        if int(existing_id) == int(recipe_id) and existing_name != recipe_name:
                            id_conflict = True
                            print(f"检测到ID冲突：配方 {recipe_name} (ID:{recipe_id}) 与现有配方 {existing_name} (ID:{existing_id}) 冲突")

        print(f"已使用的ID列表: {sorted(used_ids)}")
        print(f"ID冲突状态: {id_conflict}")

        # 第二步：如果有ID冲突，分配新ID
        if id_conflict:
            new_id = 1
            while new_id in used_ids:
                new_id += 1

            recipe_id = new_id
            id_reassigned = True
            print(f"配方 {recipe_name} 的ID从 {original_id} 重新分配为 {new_id}")

        # 获取所有数据
        table_data = data.get('tableData')
        frame_length = data.get('frameLength')
        frame_width = data.get('frameWidth')
        frame_depth = data.get('frameDepth')
        shape_height = data.get('shapeHeight')
        material_thickness = data.get('materialThickness')
        placement_layers = data.get('placementLayers')
        shape_type = data.get('shapeType')
        shape_length = data.get('shapeLength')
        shape_width = data.get('shapeWidth')
        dropCount = data.get('dropCount')
        horizontal_spacing = data.get('horizontalSpacing')
        vertical_spacing = data.get('verticalSpacing')
        horizontal_border_distance = data.get('horizontalBorderDistance')
        vertical_border_distance = data.get('verticalBorderDistance')
        layout_type = data.get('layoutType')
        place_type = data.get('placeType')
        remainder_turn = data.get('remainderTurn')
        plot_image_base64 = data.get('plotImageBase64')  # 获取Base64编码的图片数据
        shape_count_value = data.get('shapeCountValue')
        shapes_per_row_or_col_value = data.get('shapesPerRowOrColValue')

        # 检查图片数据是否存在
        if not plot_image_base64:
            print('Warning: No image data found in recipe')
            # 这里不返回错误，因为图片数据是可选的

        # 获取工件类型对应的几何参数
        circle_diameter = data.get('circleDiameter') if shape_type == 'circle' else None
        rectangle_length = data.get('rectangleLength') if shape_type == 'rectangle' else None
        rectangle_width = data.get('rectangleWidth') if shape_type == 'rectangle' else None
        polygon_sides = data.get('polygonSides') if shape_type == 'polygon' else None
        polygon_side_length = data.get('polygonSideLength') if shape_type == 'polygon' else None
        polygon_arrangement = data.get('polygonArrangement') if shape_type == 'polygon' else 'diagonal'  # 添加多边形排布方式参数
        triangle_type = data.get('triangleType') if shape_type == 'triangle' else None
        triangle_side_length = data.get('triangleSideLength') if shape_type == 'triangle' else None
        triangle_base_length = data.get('triangleBaseLength') if shape_type == 'triangle' else None
        triangle_orientation = data.get('triangleOrientation') if shape_type == 'triangle' else None

        # 将数据保存到一个 JSON 文件中（不再保存recipeName字段，因为文件名就是配方名）
        recipe_data = {
            'recipeId': recipe_id,  # 保存配方编号
            'tableData': table_data,
            'frameLength': frame_length,
            'frameWidth': frame_width,
            'frameDepth': frame_depth,
            'shapeHeight': shape_height,
            'materialThickness': material_thickness,
            'placementLayers': placement_layers,
            'shapeType': shape_type,
            'shapeLength': shape_length,
            'shapeWidth': shape_width,
            'dropCount': dropCount,
            'horizontalSpacing': horizontal_spacing,
            'verticalSpacing': vertical_spacing,
            'horizontalBorderDistance': horizontal_border_distance,
            'verticalBorderDistance': vertical_border_distance,
            'layoutType': layout_type,
            'placeType': place_type,
            'remainderTurn': remainder_turn,
            'plotImageBase64': plot_image_base64,  # 保存Base64编码的图片数据
            'shapeCountValue': shape_count_value,
            'shapesPerRowOrColValue': shapes_per_row_or_col_value,
            'circleDiameter': circle_diameter,
            'rectangleLength': rectangle_length,
            'rectangleWidth': rectangle_width,
            'polygonSides': polygon_sides,
            'polygonSideLength': polygon_side_length,
            'polygonArrangement': polygon_arrangement,  # 添加多边形排布方式参数
            'triangleType': triangle_type,
            'triangleSideLength': triangle_side_length,
            'triangleBaseLength': triangle_base_length,
            'triangleOrientation': triangle_orientation
        }

        # 保存到文件
        recipe_file_path = f'data/{recipe_name}.json'
        with open(recipe_file_path, 'w') as f:
            json.dump(recipe_data, f)
        # 确保数据写入磁盘
        os.system("sync")
        os.system("sync")

        print(f'Recipe saved successfully to {recipe_file_path}')

        # 根据是否有ID重新分配返回不同的信息
        if id_reassigned:
            print(f"返回ID重新分配结果: 原ID={original_id}, 新ID={recipe_id}")
            return JSONResponse({
                'message': f'配方保存成功，配方ID已从 {original_id} 重新分配为 {recipe_id}',
                'id_reassigned': True,
                'original_id': int(original_id),
                'new_id': int(recipe_id)
            }, 200)
        else:
            print("返回普通保存成功结果")
            return JSONResponse({'message': '配方保存成功'}, 200)

    except Exception as e:
        print(f'Error saving recipe: {str(e)}')
        return JSONResponse({'error': str(e)}, 400)

@app.post('/check_recipe')
async def check_recipe(request: Request):
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    try:
        # 获取配方名和配方编号
        recipe_name = data.get('recipeName')
        recipe_id = data.get('recipeId')  # 获取配方编号

        if not recipe_name or not recipe_id:
            return JSONResponse({'error': '缺少配方名或配方编号'}, 400)

        # 检查配方文件是否存在
        recipe_file_path = f'data/{recipe_name}.json'
        exists = os.path.exists(recipe_file_path)

        # 检查配方编号是否重复并获取所有已使用的ID
        recipe_dir = 'data'
        if not os.path.exists(recipe_dir):
            os.makedirs(recipe_dir)

        used_ids = set()
        id_exists = False
        conflicting_recipe_name = None

        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                existing_name, _ = os.path.splitext(f)  # 从文件名获取配方名
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    recipe_data = json.load(file)
                    existing_id = recipe_data.get('recipeId')

                    if existing_id is not None:
                        used_ids.add(int(existing_id))

                        # 检查ID冲突（排除同名配方的情况）
                        if int(existing_id) == int(recipe_id) and existing_name != recipe_name:
                            id_exists = True
                            conflicting_recipe_name = existing_name

        # 如果ID冲突，找到下一个可用的ID
        suggested_id = None
        if id_exists:
            new_id = 1
            while new_id in used_ids:
                new_id += 1
            suggested_id = new_id

        return JSONResponse({
            'exists': exists,  # 配方名是否存在
            'id_exists': id_exists,  # 配方编号是否存在冲突
            'conflicting_recipe_name': conflicting_recipe_name,  # 冲突的配方名
            'suggested_id': suggested_id,  # 建议的新ID
            'original_id': int(recipe_id)  # 原始ID
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.get('/get_recipe_list')
async def get_recipe_list(request: Request):
    """获取所有配方的列表"""
    try:
        recipe_dir = 'data'
        if not os.path.exists(recipe_dir):
            os.makedirs(recipe_dir)
        recipes = []
        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                recipe_name, _ = os.path.splitext(f)
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    recipe_data = json.load(file)
                    recipes.append({
                        'recipeName': recipe_name, # 确保配方名与文件名一致
                        'recipeId': recipe_data.get('recipeId')  # 确保返回 recipeId
                    })

        # 按配方ID升序排序
        recipes.sort(key=lambda x: int(x['recipeId']) if x['recipeId'] is not None else 0)

        return JSONResponse({'recipes': recipes}, 200)
    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/get_recipe')
async def get_recipe(request: Request):
    """获取指定配方的详细信息"""
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    recipe_name = data.get('recipeName')

    if not recipe_name:
        return JSONResponse({'error': '缺少配方名'}, 400)

    try:
        recipe_file_path = f'data/{recipe_name}.json'
        if not os.path.exists(recipe_file_path):
            return JSONResponse({'error': '配方不存在'}, 404)

        with open(recipe_file_path, 'r') as f:
            recipe_data = json.load(f)
        # 确保配方名与文件名一致
        recipe_name, _ = os.path.splitext(os.path.basename(recipe_file_path))
        recipe_data['recipeName'] = recipe_name

        return JSONResponse(recipe_data, 200)
    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.post('/delete_recipe')
async def delete_recipe(request: Request):
    """删除指定配方"""
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    recipe_name = data.get('recipeName')

    if not recipe_name:
        return JSONResponse({'error': '缺少配方名'}, 400)

    try:
        recipe_file_path = f'data/{recipe_name}.json'
        if not os.path.exists(recipe_file_path):
            return JSONResponse({'error': '配方不存在'}, 404)

        os.remove(recipe_file_path)
        return JSONResponse({'success': True}, 200)
    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

def check_udisk():
    """
    检查是否插入了U盘（通过lsblk命令检查可移动存储设备）
    如果存在且未挂载则自动创建设备节点并挂载

    Returns:
        tuple: (bool, str) - (是否检测到U盘并已挂载, 实际挂载点路径)
    """
    try:
        # 1. 先检查/mnt/udisk是否已经被系统自动挂载，如果有则直接使用
        print("检查/mnt/udisk是否已被挂载...")
        udisk_mount_check = subprocess.getoutput("mount | grep /mnt/udisk")
        if udisk_mount_check:
            print(f"检测到/mnt/udisk已被挂载: {udisk_mount_check}")
            print("直接使用/mnt/udisk挂载点")
            return (True, "/mnt/udisk")
        else:
            print("/mnt/udisk未被挂载，继续检测U盘设备...")

        # 2. 首先执行lsblk命令检查可移动存储设备
        output = subprocess.getoutput('lsblk -o NAME,MAJ:MIN,RM,SIZE,TYPE')
        print("lsblk输出:")
        print(output)

        # 检查输出中是否包含可移动磁盘
        usb_device = None
        device_name = None
        maj = None
        min_num = None

        output_lines = output.split('\n')
        for line in output_lines:
            parts = line.split()
            if len(parts) >= 5:
                name = parts[0].strip()
                maj_min = parts[1].strip()
                removable = parts[2].strip()
                device_type = parts[4].strip()

                # 检查是否为可移动磁盘且以sd开头
                if (name.startswith('sd') and removable == '1' and device_type == 'disk'):
                    print(f"检测到U盘设备: {line.strip()}")
                    usb_device = line.strip()
                    device_name = name
                    maj, min_num = maj_min.split(':')
                    print(f"设备名: {device_name}, 设备号: 主设备号={maj}, 次设备号={min_num}")
                    break

        # 3. 如果没有找到U盘设备，直接返回False
        if not usb_device:
            print("未检测到U盘设备")
            return (False, None)

        # 4. 设备存在，检查这个具体设备是否已经挂载
        mount_check = subprocess.getoutput(f"mount | grep /dev/{device_name}")
        if mount_check and "/mnt/usb" in mount_check:
            print(f"U盘已挂载: {mount_check}")
            return (True, "/mnt/usb")

        # 5. 设备存在但未挂载，执行挂载操作
        if maj and min_num and device_name:
            print("开始执行挂载操作...")

            # 执行挂载命令
            commands = [
                f"mknod /dev/{device_name} b {maj} {min_num}",
                f"chmod 660 /dev/{device_name}",
                "mkdir -p /mnt/usb",
                f"mount /dev/{device_name} /mnt/usb"
            ]

            for cmd in commands:
                print(f"执行命令: {cmd}")
                result = subprocess.getoutput(cmd)
                if result:  # 如果有输出，通常表示有错误或警告
                    print(f"命令输出: {result}")

            # 6. 再次检查挂载是否成功
            mount_check = subprocess.getoutput("mount | grep /mnt/usb")
            if mount_check:
                print(f"U盘挂载成功: {mount_check}")
                return (True, "/mnt/usb")
            else:
                print("U盘挂载失败")
                return (False, None)
        else:
            print("设备号解析失败")
            return (False, None)

    except Exception as e:
        print(f"检查U盘时发生错误: {e}")
        return (False, None)

def unmount_udisk(mount_path=None):
    """
    卸载U盘，确保数据写入完成

    Args:
        mount_path: 挂载点路径，如果为None则自动检测

    Returns:
        bool: True表示卸载成功，False表示卸载失败
    """
    try:
        # 1. 如果没有指定挂载点，自动检测
        if mount_path is None:
            # 检查/mnt/udisk
            udisk_check = subprocess.getoutput("mount | grep /mnt/udisk")
            # 检查/mnt/usb
            usb_check = subprocess.getoutput("mount | grep /mnt/usb")

            if udisk_check:
                mount_path = "/mnt/udisk"
            elif usb_check:
                mount_path = "/mnt/usb"
            else:
                print("U盘未挂载，无需卸载")
                return True

        # 2. 检查指定挂载点是否已挂载
        mount_check = subprocess.getoutput(f"mount | grep {mount_path}")
        if not mount_check:
            print(f"{mount_path} 未挂载，无需卸载")
            return True

        print(f"当前U盘挂载状态: {mount_check}")

        # 3. 执行sync命令，确保所有数据写入磁盘
        print("执行sync命令，确保数据写入...")
        sync_result = subprocess.getoutput("sync")
        if sync_result:
            print(f"sync命令输出: {sync_result}")

        # 4. 卸载U盘
        print(f"开始卸载U盘: {mount_path}")
        umount_result = subprocess.getoutput(f"umount {mount_path}")
        if umount_result:
            print(f"卸载命令输出: {umount_result}")
            # 如果有输出，可能是警告或错误，但不一定意味着失败

        # 5. 检查是否卸载成功
        mount_check_after = subprocess.getoutput(f"mount | grep {mount_path}")
        if not mount_check_after:
            print(f"U盘卸载成功: {mount_path}")
            return True
        else:
            print(f"U盘卸载失败，仍然挂载: {mount_check_after}")
            return False

    except Exception as e:
        print(f"卸载U盘时发生错误: {e}")
        return False

# 导出配方到U盘
@app.post('/export_recipe')
async def export_recipe(request: Request):
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    data = await request.json()
    recipe_ids = data.get('recipe_ids')
    if not recipe_ids or len(recipe_ids) == 0:
        return JSONResponse({'error': '缺少配方ID'}, 400)

    try:
        # 1. 检查U盘是否挂载
        print("开始检查U盘状态...")
        udisk_status, mount_point = check_udisk()
        if not udisk_status:
            return JSONResponse({'error': 'U盘未插入或挂载失败，请插入U盘后重试'}, 400)

        # 2. 创建autoplan_data目录
        autoplan_data_path = f"{mount_point}/autoplan_data"
        os.makedirs(autoplan_data_path, exist_ok=True)

        # 3. 创建当前时间的目录
        from datetime import datetime
        current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
        time_backup_path = os.path.join(autoplan_data_path, current_time)
        os.makedirs(time_backup_path, exist_ok=True)
        print(f"目标导出目录: {time_backup_path}")

        # 4. 获取所有配方，建立ID到配方名的映射
        recipe_dir = 'data'
        id_to_name = {}
        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    recipe_data = json.load(file)
                    recipe_id = recipe_data.get('recipeId')
                    # 确保配方名与文件名一致

                    if recipe_id:
                        recipe_name_from_file, _ = os.path.splitext(f)
                        id_to_name[int(recipe_id)] = recipe_name_from_file

        # 5. 复制配方文件到时间目录
        exported_count = 0
        for recipe_id in recipe_ids:
            recipe_name = id_to_name.get(int(recipe_id))
            if recipe_name:
                source_file = f"data/{recipe_name}.json"
                target_file = f"{time_backup_path}/{recipe_name}.json"

                # 使用Python的shutil复制文件
                if os.path.exists(source_file):
                    shutil.copy2(source_file, target_file)
                    print(f"配方 {recipe_name}.json 复制成功")
                    exported_count += 1
                else:
                    print(f"配方 {recipe_name}.json 源文件不存在")

        # 6. 确保文件写入磁盘
        os.system("sync")
        os.system("sync")

        # 7. 文件操作完成后，卸载U盘确保数据写入成功
        # print("文件导出完成，开始卸载U盘...")
        # unmount_success = unmount_udisk(mount_point)
        # if not unmount_success:
        #     print("警告：U盘卸载失败，但文件已导出完成")

        return JSONResponse({
            'message': f"成功导出 {exported_count} 个配方到U盘 ({current_time})",
            'timestamp': current_time,
            'backup_path': current_time,
            # 'unmount_success': unmount_success
        }, 200)

    except Exception as e:
        return JSONResponse({'error': f'导出失败: {str(e)}'}, 400)

# 获取U盘中的备份时间目录列表
@app.post('/get_backup_timestamps')
async def get_backup_timestamps(request: Request):
    """获取U盘中autoplan_data目录下的所有时间备份目录"""
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    try:
        # 1. 检查U盘是否挂载
        print("开始检查U盘状态...")
        udisk_status, mount_point = check_udisk()
        if not udisk_status:
            return JSONResponse({'error': 'U盘未插入或挂载失败，请插入U盘后重试'}, 400)

        # 2. 检查autoplan_data目录是否存在
        autoplan_data_path = f"{mount_point}/autoplan_data"
        if not os.path.exists(autoplan_data_path):
            return JSONResponse({'error': 'U盘中未找到autoplan_data目录'}, 400)

        # 3. 读取目录中的所有子目录（时间备份目录）
        backup_timestamps = []
        for item in os.listdir(autoplan_data_path):
            item_path = os.path.join(autoplan_data_path, item)
            if os.path.isdir(item_path):
                # 检查是否包含配方文件（排除备份信息文件）
                json_files = [f for f in os.listdir(item_path) if f.endswith('.json') and not f.startswith('_')]
                if json_files:
                    # 格式化时间显示
                    display_time = item
                    export_date = ""
                    if len(item) == 15 and '_' in item:  # 格式：20231201_143059
                        try:
                            from datetime import datetime
                            dt = datetime.strptime(item, "%Y%m%d_%H%M%S")
                            display_time = dt.strftime("%Y年%m月%d日 %H:%M:%S")
                            export_date = dt.strftime("%Y-%m-%d %H:%M:%S")
                        except:
                            pass

                    backup_timestamps.append({
                        'timestamp': item,
                        'display_time': display_time,
                        'export_date': export_date,
                        'recipe_count': len(json_files)
                    })

        # 按时间戳降序排列（最新的在前面）
        backup_timestamps.sort(key=lambda x: x['timestamp'], reverse=True)

        print(f"在U盘中找到 {len(backup_timestamps)} 个备份目录")
        return JSONResponse({
            'timestamps': backup_timestamps,
            'count': len(backup_timestamps)
        }, 200)

    except Exception as e:
        return JSONResponse({'error': f'读取备份目录失败: {str(e)}'}, 400)

# 获取U盘中的配方列表
@app.post('/get_usb_recipes')
async def get_usb_recipes(request: Request):
    """获取U盘中指定时间目录下的所有配方文件"""
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    data = await request.json()
    timestamp = data.get('timestamp')  # 时间戳目录名
    if not timestamp:
        return JSONResponse({'error': '缺少时间戳参数'}, 400)

    try:
        # 1. 检查U盘是否挂载
        print("开始检查U盘状态...")
        udisk_status, mount_point = check_udisk()
        if not udisk_status:
            return JSONResponse({'error': 'U盘未插入或挂载失败，请插入U盘后重试'}, 400)

        # 2. 检查autoplan_data目录是否存在
        autoplan_data_path = f"{mount_point}/autoplan_data"
        if not os.path.exists(autoplan_data_path):
            return JSONResponse({'error': 'U盘中未找到autoplan_data目录'}, 400)

        # 3. 检查指定的时间目录是否存在
        timestamp_path = os.path.join(autoplan_data_path, timestamp)
        if not os.path.exists(timestamp_path):
            return JSONResponse({'error': f'时间目录 {timestamp} 不存在'}, 400)

        # 4. 读取时间目录中的所有json文件（排除备份信息文件）
        usb_recipes = []
        for filename in os.listdir(timestamp_path):
            if filename.endswith('.json') and not filename.startswith('_'):
                file_path = os.path.join(timestamp_path, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        recipe_data = json.load(f)
                        recipe_name_from_file, _ = os.path.splitext(filename)  # 从文件名获取配方名
                        usb_recipes.append({
                            'filename': filename,
                            'recipeName': recipe_name_from_file,
                            'recipeId': recipe_data.get('recipeId', ''),
                            'size': os.path.getsize(file_path)
                        })
                except Exception as e:
                    print(f"读取配方文件 {filename} 失败: {e}")
                    # 如果读取失败，仍然添加到列表中，但标记为有问题
                    usb_recipes.append({
                        'filename': filename,
                        'recipeName': filename.replace('.json', ''),
                        'recipeId': '',
                        'size': os.path.getsize(file_path),
                        'error': '文件读取失败'
                    })

        print(f"在U盘时间目录 {timestamp} 中找到 {len(usb_recipes)} 个配方文件")
        return JSONResponse({
            'recipes': usb_recipes,
            'count': len(usb_recipes),
            'timestamp': timestamp
        }, 200)

    except Exception as e:
        return JSONResponse({'error': f'读取U盘配方失败: {str(e)}'}, 400)

# 从U盘导入配方
@app.post('/import_recipes_from_usb')
async def import_recipes_from_usb(request: Request):
    """从U盘导入选中的配方到本地data目录"""
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    data = await request.json()
    selected_filenames = data.get('filenames')
    timestamp = data.get('timestamp')  # 时间戳目录名
    conflict_action = data.get('conflict_action', 'ask')  # ask, skip, overwrite

    if not selected_filenames or len(selected_filenames) == 0:
        return JSONResponse({'error': '未选择要导入的配方'}, 400)
    if not timestamp:
        return JSONResponse({'error': '缺少时间戳参数'}, 400)

    try:
        # 1. 检查U盘是否挂载
        print("开始检查U盘状态...")
        udisk_status, mount_point = check_udisk()
        if not udisk_status:
            return JSONResponse({'error': 'U盘未插入或挂载失败，请插入U盘后重试'}, 400)

        # 2. 检查autoplan_data目录是否存在
        autoplan_data_path = f"{mount_point}/autoplan_data"
        if not os.path.exists(autoplan_data_path):
            return JSONResponse({'error': 'U盘中未找到autoplan_data目录'}, 400)

        # 3. 确保本地data目录存在
        local_data_path = "data"
        os.makedirs(local_data_path, exist_ok=True)

        # 3. 检查指定的时间目录是否存在
        timestamp_path = os.path.join(autoplan_data_path, timestamp)
        if not os.path.exists(timestamp_path):
            return JSONResponse({'error': f'时间目录 {timestamp} 不存在'}, 400)

        # 4. 获取当前所有本地配方，用于检查冲突
        local_recipes = []
        for file in os.listdir(local_data_path):
            if file.endswith('.json'):
                try:
                    recipe_name_from_file, _ = os.path.splitext(file)
                    with open(os.path.join(local_data_path, file), 'r', encoding='utf-8') as f:
                        recipe_data = json.load(f)
                        local_recipes.append({
                            'filename': file,
                            'recipeName': recipe_name_from_file,
                            'recipeId': recipe_data.get('recipeId')
                        })
                except:
                    continue

        # 5. 创建已使用ID集合，用于跟踪所有已分配的ID
        used_ids = set(int(recipe['recipeId']) for recipe in local_recipes if recipe['recipeId'] is not None)

        # 6. 逐个导入选中的配方
        imported_count = 0
        skipped_count = 0
        id_reassigned_count = 0
        error_list = []
        reassigned_list = []

        for filename in selected_filenames:
            try:
                source_file = os.path.join(timestamp_path, filename)

                # 检查源文件是否存在
                if not os.path.exists(source_file):
                    error_list.append(f"{filename}: 源文件不存在")
                    continue

                # 读取要导入的配方数据
                with open(source_file, 'r', encoding='utf-8') as f:
                    import_data = json.load(f)

                import_recipe_name, _ = os.path.splitext(filename)  # 从文件名获取配方名
                import_recipe_id = import_data.get('recipeId')

                # 检查重名冲突
                name_conflict = any(recipe['recipeName'] == import_recipe_name for recipe in local_recipes)

                # 检查配方号冲突
                id_conflict = import_recipe_id is not None and int(import_recipe_id) in used_ids

                # 处理重名冲突
                if name_conflict:
                    if conflict_action == 'skip':
                        print(f"配方 {filename} 重名，跳过导入")
                        skipped_count += 1
                        continue
                    elif conflict_action == 'ask':
                        # 如果需要询问用户，返回冲突信息
                        continue
                    # 如果是 overwrite，继续处理

                # 处理配方号冲突 - 自动分配新号码
                if id_conflict and not name_conflict:  # 只有ID冲突但不重名时才自动分配
                    # 找到下一个可用的配方号
                    new_id = 1
                    while new_id in used_ids:
                        new_id += 1

                    # 更新配方数据
                    import_data['recipeId'] = new_id
                    reassigned_list.append(f"{import_recipe_name}: {import_recipe_id} → {new_id}")
                    id_reassigned_count += 1
                    print(f"配方 {filename} 的ID从 {import_recipe_id} 重新分配为 {new_id}")

                    # 将新分配的ID加入已使用列表，避免后续冲突
                    used_ids.add(new_id)

                # 确定目标文件名
                target_file = os.path.join(local_data_path, filename)

                # 写入文件
                with open(target_file, 'w', encoding='utf-8') as f:
                    json.dump(import_data, f, ensure_ascii=False, indent=2)

                print(f"配方 {filename} 导入成功")
                imported_count += 1

                # 更新本地配方列表（为下一个配方检查做准备）
                recipe_id = import_data.get('recipeId')
                local_recipes.append({
                    'filename': filename,
                    'recipeName': import_recipe_name,  # 使用从文件名获取的配方名
                    'recipeId': recipe_id
                })

                # 将导入的配方ID也加入已使用列表
                if recipe_id is not None:
                    used_ids.add(int(recipe_id))

            except Exception as e:
                error_msg = f"{filename}: {str(e)}"
                print(f"导入配方 {filename} 失败: {e}")
                error_list.append(error_msg)

        # 6. 文件操作完成后，卸载U盘确保数据写入成功
        print("文件导入完成，开始卸载U盘...")
        # unmount_success = unmount_udisk(mount_point)
        # if not unmount_success:
        #     print("警告：U盘卸载失败，但文件已导入完成")

        # 7. 返回导入结果
        result_msg = f"成功导入 {imported_count} 个配方"
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
        }, 200)

    except Exception as e:
        return JSONResponse({'error': f'导入失败: {str(e)}'}, 400)

@app.post('/check_import_conflicts')
async def check_import_conflicts(request: Request):
    """检查导入配方的冲突情况"""
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    data = await request.json()
    selected_filenames = data.get('filenames')
    timestamp = data.get('timestamp')  # 时间戳目录名

    if not selected_filenames or len(selected_filenames) == 0:
        return JSONResponse({'error': '未选择要检查的配方'}, 400)
    if not timestamp:
        return JSONResponse({'error': '缺少时间戳参数'}, 400)

    try:
        # 1. 检查U盘是否挂载
        udisk_status, mount_point = check_udisk()
        if not udisk_status:
            return JSONResponse({'error': 'U盘未插入或挂载失败，请插入U盘后重试'}, 400)

        # 2. 检查autoplan_data目录是否存在
        autoplan_data_path = f"{mount_point}/autoplan_data"
        if not os.path.exists(autoplan_data_path):
            return JSONResponse({'error': 'U盘中未找到autoplan_data目录'}, 400)

        # 3. 检查指定的时间目录是否存在
        timestamp_path = os.path.join(autoplan_data_path, timestamp)
        if not os.path.exists(timestamp_path):
            return JSONResponse({'error': f'时间目录 {timestamp} 不存在'}, 400)

        # 4. 确保本地data目录存在
        local_data_path = "data"
        os.makedirs(local_data_path, exist_ok=True)

        # 5. 获取当前所有本地配方，用于检查冲突
        local_recipes = []
        for file in os.listdir(local_data_path):
            if file.endswith('.json'):
                try:
                    recipe_name_from_file, _ = os.path.splitext(file)
                    with open(os.path.join(local_data_path, file), 'r', encoding='utf-8') as f:
                        recipe_data = json.load(f)
                        local_recipes.append({
                            'filename': file,
                            'recipeName': recipe_name_from_file,
                            'recipeId': recipe_data.get('recipeId')
                        })
                except:
                    continue

        # 6. 分析每个要导入的配方
        name_conflicts = []
        id_reassignments = []

        used_ids = set(int(recipe['recipeId']) for recipe in local_recipes if recipe['recipeId'] is not None)

        for filename in selected_filenames:
            try:
                source_file = os.path.join(timestamp_path, filename)

                if not os.path.exists(source_file):
                    continue

                # 读取要导入的配方数据
                with open(source_file, 'r', encoding='utf-8') as f:
                    import_data = json.load(f)

                import_recipe_name, _ = os.path.splitext(filename)  # 从文件名获取配方名
                import_recipe_id = import_data.get('recipeId')

                # 检查重名冲突
                name_conflict = any(recipe['recipeName'] == import_recipe_name for recipe in local_recipes)

                # 检查配方号冲突
                id_conflict = import_recipe_id is not None and int(import_recipe_id) in used_ids

                if name_conflict:
                    # 找到重名的本地配方
                    local_recipe = next(recipe for recipe in local_recipes if recipe['recipeName'] == import_recipe_name)
                    name_conflicts.append({
                        'filename': filename,
                        'usbRecipeName': import_recipe_name,
                        'usbRecipeId': import_recipe_id,
                        'localRecipeName': local_recipe['recipeName'],
                        'localRecipeId': local_recipe['recipeId']
                    })
                elif id_conflict:
                    # 找到下一个可用的配方号
                    new_id = 1
                    while new_id in used_ids:
                        new_id += 1

                    id_reassignments.append({
                        'filename': filename,
                        'recipeName': import_recipe_name,
                        'originalId': import_recipe_id,
                        'newId': new_id
                    })

                    # 将新分配的ID加入已使用列表，避免后续冲突
                    used_ids.add(new_id)

            except Exception as e:
                print(f"检查配方 {filename} 时出错: {e}")
                continue

        return JSONResponse({
            'hasNameConflicts': len(name_conflicts) > 0,
            'hasIdReassignments': len(id_reassignments) > 0,
            'nameConflicts': name_conflicts,
            'idReassignments': id_reassignments
        }, 200)

    except Exception as e:
        return JSONResponse({'error': f'检查冲突失败: {str(e)}'}, 400)

# 手动卸载U盘
@app.post('/unmount_udisk')
async def unmount_udisk_route(request: Request):
    """手动卸载U盘，确保数据写入完成"""
    if platform.system().lower() == 'windows':
        return JSONResponse({'error': '暂不支持PC版'}, 400)

    try:
        # 执行U盘卸载操作
        print("开始手动卸载U盘...")
        unmount_success = unmount_udisk()

        if unmount_success:
            return JSONResponse({
                'message': 'U盘卸载成功，可以安全拔出',
                'unmount_success': True
            }, 200)
        else:
            return JSONResponse({
                'message': 'U盘卸载失败，请检查是否有程序正在使用U盘',
                'unmount_success': False
            }, 400)

    except Exception as e:
        return JSONResponse({'error': f'卸载U盘失败: {str(e)}'}, 400)

# 读取DI信号状态
@app.post('/read_di_signal')
async def read_di_signal(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    di_number = data.get('di_number')

    if di_number is None:
        return JSONResponse({'error': '缺少DI信号编号'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取指定DI信号的状态
        di_value, ret = robot_arm.signals.read(SignalType.DI, int(di_number))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取DI信号失败'}, 400)

        # 打印DI信号状态
        print(f"DI{di_number} 信号状态: {di_value}")

        return JSONResponse({
            'di_value': di_value
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 读取MH寄存器值
@app.post('/read_mh_register')
async def read_mh_register(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    mh_number = data.get('mh_number')

    if mh_number is None:
        return JSONResponse({'error': '缺少MH寄存器编号'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取指定MH寄存器的值
        mh_value, ret = robot_arm.register.read_MH(int(mh_number))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取MH寄存器失败'}, 400)

        # 打印MH寄存器值
        print(f"MH{mh_number} 寄存器值: {mh_value}")

        return JSONResponse({
            'mh_value': mh_value
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 外部调用监控
@app.post('/start_external_call_monitor')
async def start_external_call_monitor(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    mh_number = data.get('mh_number')
    di_number = data.get('di_number')

    if mh_number is None or di_number is None:
        return JSONResponse({'error': '缺少MH编号或DI编号'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 读取指定DI信号的状态
        di_value, ret = robot_arm.signals.read(SignalType.DI, int(di_number))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '读取DI信号失败'}, 400)

        # 打印DI信号状态
        print(f"监控 - DI{di_number} 信号状态: {di_value}")

        # 如果DI信号为1，则读取MH寄存器值
        if di_value == 1:
            mh_value, ret = robot_arm.register.read_MH(int(mh_number))
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': '读取MH寄存器失败'}, 400)

            # 打印MH寄存器值
            print(f"监控 - DI{di_number} 触发，MH{mh_number} 寄存器值: {mh_value}")

            return JSONResponse({
                'di_value': di_value,
                'mh_value': mh_value,
                'triggered': True
            }, 200)
        else:
            return JSONResponse({
                'di_value': di_value,
                'triggered': False
            }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 检查机器人状态
@app.post('/check_robot_status')
async def check_robot_status(request: Request):
    global robot_arm

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 获取机器人运行状态
        state, ret = robot_arm.get_robot_status()
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '获取机器人状态失败'}, 400)

        # 打印机器人状态
        print(f"机器人运行状态：{state.msg}")

        # 检查是否为空闲状态
        is_idle = state.msg == "机器人空闲"

        return JSONResponse({
            'status': state.msg,
            'is_idle': is_idle
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 检查运行中的程序
@app.post('/check_running_programs')
async def check_running_programs(request: Request):
    global robot_arm

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 获取所有正在运行的程序
        programs_list, ret = robot_arm.execution.all_running_programs()
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '获取运行程序列表失败'}, 400)

        # 打印运行中的程序
        running_programs = []
        for program in programs_list:
            running_programs.append(program.program_name)
            print(f"正在运行的程序名：{program.program_name}")

        # 检查是否有程序在运行
        has_running_programs = len(running_programs) > 0

        return JSONResponse({
            'running_programs': running_programs,
            'has_running_programs': has_running_programs
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

# 自动写入配方到机器人
@app.post('/auto_write_recipe')
async def auto_write_recipe(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    recipe_name = data.get('recipe_name')

    if not recipe_name:
        return JSONResponse({'error': '缺少配方名称'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 1. 检查机器人状态
        state, ret = robot_arm.get_robot_status()
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '获取机器人状态失败'}, 400)

        if state.msg != "机器人空闲":
            return JSONResponse({'error': f'机器人当前状态：{state.msg}，无法自动写入'}, 400)

        # 2. 检查运行中的程序
        programs_list, ret = robot_arm.execution.all_running_programs()
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '获取运行程序列表失败'}, 400)

        if len(programs_list) > 0:
            running_programs = [p.program_name for p in programs_list]
            return JSONResponse({'error': f'当前有程序在运行：{running_programs}，无法自动写入'}, 400)

        # 3. 读取配方数据
        recipe_file_path = f'data/{recipe_name}.json'
        if not os.path.exists(recipe_file_path):
            return JSONResponse({'error': '配方不存在'}, 404)

        with open(recipe_file_path, 'r') as f:
            recipe_data = json.load(f)

        # 4. 获取程序名称（假设程序名称与配方名称相同）
        program_name = recipe_name

        # 5. 获取配方中的P点数据
        table_data = recipe_data.get('tableData', [])
        if not table_data:
            return JSONResponse({'error': '配方中没有P点数据'}, 400)

        # 6. 批量写入P点数据
        for p in table_data:
            pose_id = p['pId']  # 使用pId而不是id
            x = float(p['x'])
            y = float(p['y'])
            z = float(p.get('z', 0))  # 添加默认值，因为配方数据中可能没有z字段
            c = float(p['c'])
            uf = int(p.get('uf', 1))  # 使用默认值1
            tf = int(p.get('tf', 1))  # 使用默认值1
            left_right = int(p.get('left_right', 1))  # 使用默认值1

            print(f"正在写入P点 {pose_id}: x={x}, y={y}, z={z}, c={c}, uf={uf}, tf={tf}, left_right={left_right}")

            # 读取当前P点的位姿数据
            assert robot_arm is not None  # 类型检查器断言
            pose, ret = robot_arm.program_pose.read(program_name, pose_id)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'读取P点 {pose_id} 数据失败'}, 400)

            # 修改位姿数据
            pose.poseData.cartData.baseCart.position.x = x
            pose.poseData.cartData.baseCart.position.y = y
            pose.poseData.cartData.baseCart.position.z = z
            pose.poseData.cartData.baseCart.position.c = c
            pose.poseData.cartData.uf = uf
            pose.poseData.cartData.tf = tf
            pose.poseData.cartData.baseCart.posture.arm_left_right = left_right

            # 将修改后的位姿数据写回
            assert robot_arm is not None  # 类型检查器断言
            ret = robot_arm.program_pose.write(program_name, pose_id, pose)
            if ret != StatusCodeEnum.OK:
                return JSONResponse({'error': f'写入P点 {pose_id} 数据失败'}, 400)

        print(f"自动写入配方 {recipe_name} 成功")

        return JSONResponse({'message': f'配方 {recipe_name} 自动写入成功'}, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

@app.get('/get_robot_ip')
async def get_robot_ip(request: Request):
    """获取机器人IP地址"""
    try:
        extension = Extension()
        robot_ip = extension.get_robot_ip()

        # 如果获取到IP地址，返回成功
        if robot_ip:
            return JSONResponse({
                'success': True,
                'robot_ip': robot_ip
            }, 200)
        else:
            # 如果没有获取到IP地址（比如在电脑上运行），返回None
            return JSONResponse({
                'success': False,
                'robot_ip': None,
                'message': '无法获取机器人IP地址'
            }, 200)

    except Exception as e:
        return JSONResponse({
            'success': False,
            'robot_ip': None,
            'error': str(e)
        }, 400)

# 设置DO信号值
@app.post('/set_do_signal')
async def set_do_signal(request: Request):
    global robot_arm
    data = await request.json()

    if data is None:
        return JSONResponse({'error': '无效的请求数据'}, 400)

    do_number = data.get('do_number')
    do_value = data.get('do_value')

    if do_number is None or do_value is None:
        return JSONResponse({'error': '缺少DO编号或DO值'}, 400)

    if robot_arm is None:
        return JSONResponse({'error': '未连接机器人'}, 400)

    try:
        # 设置指定DO信号的值
        ret = robot_arm.signals.write(SignalType.DO, int(do_number), int(do_value))
        if ret != StatusCodeEnum.OK:
            return JSONResponse({'error': '设置DO信号失败'}, 400)

        # 打印DO信号设置状态
        print(f"DO{do_number} 信号设置为: {do_value}")

        return JSONResponse({
            'success': True,
            'message': f'DO{do_number} 信号设置为 {do_value}'
        }, 200)

    except Exception as e:
        return JSONResponse({'error': str(e)}, 400)

if __name__ == '__main__':
    # Windows下使用Debug，部署后关闭
    is_debug = platform.system().lower() == 'windows'
    uvicorn.run(
        app=app,
        host="127.0.0.1" if is_debug else "0.0.0.0",
        port=int(PORT),
    )
