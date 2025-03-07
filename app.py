#打包命令
#pyinstaller --onefile --add-data "templates;templates" --add-data "static;static" -i C:\Users\Phoenix\Documents\AUTOPLAN\AUTOPLAN_V3.3\static\favicon.ico --name 启动系统 app.py

from flask import Flask, render_template, request, send_file, jsonify
import matplotlib
matplotlib.use('Agg')  # 设置为非交互式后端
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, Polygon
import io
import math
import os
import json
from Agilebot.IR.A.arm import Arm
from Agilebot.IR.A.status_code import StatusCodeEnum
from Agilebot.IR.A.sdk_types import CoordinateSystemType

app = Flask(__name__)
robot_arm = None
def calculate_bounding_box(vertices):
    """计算给定顶点的最小外接矩形"""
    x_cords = [v[0] for v in vertices]
    y_cords = [v[1] for v in vertices]
    min_x, max_x = min(x_cords), max(x_cords)
    min_y, max_y = min(y_cords), max(y_cords)
    return min_x, min_y, max_x - min_x, max_y - min_y

def calculate_shape_centers(frame_length, frame_width, shape_length, shape_width, horizontal_spacing, vertical_spacing, horizontal_border_distance, vertical_border_distance,
                            is_circle=False, is_rectangle=False, polygon_sides=None, is_triangle=False, triangle_type=None, triangle_orientation=None, is_honeycomb=False, place_type='row'):
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
                polygons_per_row = math.floor((effective_row_length - bounding_box_length) / (bounding_box_length + horizontal_spacing))
                if effective_row_length - (polygons_per_row * (bounding_box_length + horizontal_spacing) + bounding_box_length) >= 0:
                    polygons_per_row += 1

                polygons_per_column = math.floor((effective_column_width - bounding_box_width) / (bounding_box_width * math.sqrt(3) / 2 + vertical_spacing))
                if effective_column_width - (polygons_per_column * (bounding_box_width * math.sqrt(3) / 2 + vertical_spacing) + bounding_box_width) >= 0:
                    polygons_per_column += 1

                total_shapes = 0
                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = polygons_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(polygons_per_column):
                        for col in range(polygons_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (bounding_box_length + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1
                else:
                    shapes_per_row_or_col = polygons_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(polygons_per_row):
                        for row in range(polygons_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width * math.sqrt(3) / 2 + vertical_spacing), 2)
                            if row % 2 == 1:
                                x_center = round(x_center + (bounding_box_length + horizontal_spacing) / 2, 2)

                            # 检查是否超出边框
                            if x_center + bounding_box_length / 2 <= frame_length - horizontal_border_distance and y_center + bounding_box_width / 2 <= frame_width - vertical_border_distance:
                                shape_centers.append((x_center, y_center))
                                row_col_info.append((row + 1, col + 1))  # 记录行号和列号
                                total_shapes += 1

            else:
                # 阵列式排布
                polygons_per_row = math.floor((effective_row_length - bounding_box_length) / (bounding_box_length + horizontal_spacing))
                if effective_row_length - (polygons_per_row * (bounding_box_length + horizontal_spacing) + bounding_box_length) >= 0:
                    polygons_per_row += 1

                polygons_per_column = math.floor((effective_column_width - bounding_box_width) / (bounding_box_width + vertical_spacing))
                if effective_column_width - (polygons_per_column * (bounding_box_width + vertical_spacing) + bounding_box_width) >= 0:
                    polygons_per_column += 1

                total_shapes = polygons_per_row * polygons_per_column

                shape_centers = []
                row_col_info = []  # 用于存储每个点的行号和列号

                if place_type == 'row':
                    shapes_per_row_or_col = polygons_per_row  # 行优先时，单行填充数量为 circles_per_row
                    for row in range(polygons_per_column):
                        for col in range(polygons_per_row):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width + vertical_spacing), 2)
                            shape_centers.append((x_center, y_center))
                            row_col_info.append((row + 1, col + 1))  # 记录行号和列号

                else:
                    shapes_per_row_or_col = polygons_per_column  # 列优先时，单列填充数量为 circles_per_column
                    for col in range(polygons_per_row):
                        for row in range(polygons_per_column):
                            x_center = round(horizontal_border_distance + bounding_box_length / 2 + col * (bounding_box_length + horizontal_spacing), 2)
                            y_center = round(vertical_border_distance + bounding_box_width / 2 + row * (bounding_box_width + vertical_spacing), 2)
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
@app.route('/')
def index():
    """渲染前端页面"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """接收前端请求，计算并返回结果"""
    data = request.json
    try:
        # 检查必需字段是否存在
        required_fields = [
            'frame_length', 'frame_width', 'shape_length', 'horizontal_spacing',
            'vertical_spacing', 'horizontal_border_distance','vertical_border_distance', 'shape_type', 'layout_type', 'place_type',
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'缺少必需字段: {field}'}), 400

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
        place_type = data.get('place_type', 'row')  # 默认值为 'row
        remainder_turn = data.get('remainder_turn', 'off')  # 默认值为 'off'

        # 处理 shape_width
        shape_width = data.get('shape_width', '')  # 获取 shape_width，默认为空字符串
        if shape_width == '':
            if shape_type == 'triangle' and triangle_type == 'equilateral':
                shape_width = shape_length  # 等边三角形的底边长等于边长
            else:
                return jsonify({'error': 'shape_width 不能为空'}), 400
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
            place_type = place_type
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
                for i in range(polygon_sides):
                    x = center[0] + circumradius * math.cos(i * math.pi * 2 / polygon_sides)
                    y = center[1] + circumradius * math.sin(i * math.pi * 2 / polygon_sides)
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
        response = send_file(buf, mimetype='image/png')
        response.headers['X-Total-Shapes'] = str(total_shapes)
        response.headers['X-Shape-Centers'] = json.dumps(shape_centers)
        response.headers['X-Shapes-Per-Row-Or-Col'] = str(shapes_per_row_or_col)  # 返回单行/列填充数量
        response.headers['X-Row-Col-Info'] = json.dumps(row_col_info)  # 返回行号和列号信息
        response.headers['X-Rows'] = str(rows)  # 返回行数
        response.headers['X-Cols'] = str(cols)  # 返回列数
        response.headers['X-Remainder-Turn'] = remainder_turn  # 返回余行列转向选项
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/connect_robot', methods=['POST'])
def connect_robot():
    global robot_arm
    data = request.json
    robot_ip = data.get('robot_ip')

    if not robot_ip:
        return jsonify({'error': '缺少机器人IP地址'}), 400

    try:
        # 如果IP地址是970215，模拟连接成功
        if robot_ip == '970215':
            return jsonify({
                'model_info': '模拟机器人型号',
                'controller_version': '模拟控制柜版本'
            }), 200

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
            return jsonify({'error': error_msg}), 400

        # 获取型号
        ret, model_info = robot_arm.get_arm_model_info()
        if ret != StatusCodeEnum.OK:
            # 获取型号失败时，清理连接状态
            robot_arm.disconnect()
            robot_arm = None
            return jsonify({'error': '获取型号失败: ' + ret.errmsg}), 400

        # 获取控制柜版本
        ret, version_info = robot_arm.get_version()
        if ret != StatusCodeEnum.OK:
            # 获取版本失败时，清理连接状态
            robot_arm.disconnect()
            robot_arm = None
            return jsonify({'error': '获取控制柜版本失败: ' + ret.errmsg}), 400

        # 返回型号和控制柜版本信息，保持连接状态
        return jsonify({
            'model_info': model_info,
            'controller_version': version_info
        }), 200

    except Exception as e:
        # 发生异常时，清理连接状态
        if robot_arm is not None:
            robot_arm.disconnect()
            robot_arm = None
        return jsonify({'error': str(e)}), 400

@app.route('/disconnect_robot', methods=['POST'])
def disconnect_robot_route():
    global robot_arm
    if robot_arm is not None:
        robot_arm.disconnect()
        robot_arm = None
        return jsonify({'message': '已断开连接'}), 200
    else:
        return jsonify({'error': '未连接机器人'}), 400


@app.route('/get_p_data', methods=['POST'])
def get_p_data():
    global robot_arm
    data = request.json
    program_name = data.get('program_name')

    if not program_name:
        return jsonify({'error': '缺少程序名称'}), 400

    if robot_arm is None:
        return jsonify({'error': '未连接机器人'}), 400

    try:
        # 读取所有位姿
        poses, ret = robot_arm.program_pose.read_all_poses(program_name)
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取P点数据失败'}), 400

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

        return jsonify({'poses': poses_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/write_p_data', methods=['POST'])
def write_p_data():
    global robot_arm
    data = request.json
    program_name = data.get('program_name')
    p_data = data.get('p_data')

    if not program_name or not p_data:
        return jsonify({'error': '缺少程序名称或P点数据'}), 400

    if robot_arm is None:
        return jsonify({'error': '未连接机器人'}), 400

    try:
        # 检查机器人状态
        ret, state = robot_arm.get_robot_status()
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '获取机器人状态失败'}), 400

        # 检查机器人是否处于空闲状态
        if state.msg != "机器人空闲":
            return jsonify({'error': '机器人当前不处于空闲状态，无法写入P点'}), 400

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
            pose, ret = robot_arm.program_pose.read(program_name, pose_id)
            if ret != StatusCodeEnum.OK:
                return jsonify({'error': f'读取P点 {pose_id} 数据失败'}), 400

            # 修改位姿数据的X、Y、Z、C坐标，并更新UF和TF值
            pose.poseData.cartData.baseCart.position.x = x
            pose.poseData.cartData.baseCart.position.y = y
            pose.poseData.cartData.baseCart.position.z = z
            pose.poseData.cartData.baseCart.position.c = c
            pose.poseData.cartData.uf = uf  # 更新UF值
            pose.poseData.cartData.tf = tf  # 更新TF值
            pose.poseData.cartData.baseCart.posture.arm_left_right = left_right  # 更新坐标系方向值

            # 将修改后的位姿数据写回
            ret = robot_arm.program_pose.write(program_name, pose_id, pose)
            if ret != StatusCodeEnum.OK:
                return jsonify({'error': f'写入P点 {pose_id} 数据失败'}), 400

        return jsonify({'message': 'P点数据写入成功'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/read_pr_register', methods=['POST'])
def read_pr_register():
    global robot_arm
    data = request.json
    pr_register_id = data.get('pr_register_id')
    print(f"读取PR寄存器 {pr_register_id} 的C值")  # 打印调试信息

    if pr_register_id is None:
        return jsonify({'error': '缺少PR寄存器ID'}), 400

    try:
        pr_register_id = int(pr_register_id)  # 确保PR寄存器ID是整数
    except ValueError:
        return jsonify({'error': 'PR寄存器ID必须是整数'}), 400

    if robot_arm is None:
        return jsonify({'error': '未连接机器人'}), 400

    try:
        # 读取位姿寄存器
        pose_register, ret = robot_arm.pose_register.read(pr_register_id)
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取PR寄存器失败'}), 400

        # 打印调试信息
        print(f"PR寄存器 {pr_register_id} 的Z值: {pose_register.poseRegisterData.cartData.position.z}")
        print(f"PR寄存器 {pr_register_id} 的C值: {pose_register.poseRegisterData.cartData.position.c}")

        # 返回Z和C的值
        return jsonify({
            'z': pose_register.poseRegisterData.cartData.position.z,
            'c': pose_register.poseRegisterData.cartData.position.c
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 新增：写入R寄存器的路由
@app.route('/write_r_registers', methods=['POST'])
def write_r_registers():
    data = request.json

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
        return jsonify({'error': '未连接机器人'}), 400

    try:

        # 写入R1寄存器（图形高度）
        register, ret = robot_arm.register.read(1)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R1寄存器失败'}), 400
        register.value = float(shape_height)  # 更新值
        ret = robot_arm.register.write(1, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R1寄存器失败'}), 400

        # 写入R2寄存器（包材厚度）
        register, ret = robot_arm.register.read(2)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R2寄存器失败'}), 400
        register.value = float(material_thickness)  # 更新值
        ret = robot_arm.register.write(2, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R2寄存器失败'}), 400

        # 写入R3寄存器（摆放层数）
        register, ret = robot_arm.register.read(3)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R3寄存器失败'}), 400
        register.value = int(placement_layers)  # 更新值
        ret = robot_arm.register.write(3, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R3寄存器失败'}), 400

         # 写入R4寄存器（填充数量）
        register, ret = robot_arm.register.read(4)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R4寄存器失败'}), 400
        register.value = int(total_shapes)  # 更新值
        ret = robot_arm.register.write(4, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R4寄存器失败'}), 400

        # 写入R5寄存器（工具数量）
        register, ret = robot_arm.register.read(5)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R5寄存器失败'}), 400
        register.value = int(tool_count)  # 更新值
        ret = robot_arm.register.write(5, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R5寄存器失败'}), 400

        # 写入R6寄存器（边框深度）
        register, ret = robot_arm.register.read(6)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R6寄存器失败'}), 400
        register.value = float(frame_depth)  # 更新值
        ret = robot_arm.register.write(6, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R6寄存器失败'}), 400

        # 写入R7寄存器（料框长度）
        register, ret = robot_arm.register.read(7)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R7寄存器失败'}), 400
        register.value = int(frame_length)  # 更新值
        ret = robot_arm.register.write(7, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R7寄存器失败'}), 400

        # 写入R8寄存器（料框宽度）
        register, ret = robot_arm.register.read(8)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R8寄存器失败'}), 400
        register.value = int(frame_width)  # 更新值
        ret = robot_arm.register.write(8, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R8寄存器失败'}), 400

        # 写入R9寄存器（前端下料数量）
        register, ret = robot_arm.register.read(9)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R9寄存器失败'}), 400
        register.value = int(drop_Count)  # 更新值
        ret = robot_arm.register.write(9, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R9寄存器失败'}), 400

         # 写入R10寄存器（单行列数量）
        register, ret = robot_arm.register.read(10)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R10寄存器失败'}), 400
        register.value = int(numofsingle_row_columns)  # 更新值
        ret = robot_arm.register.write(10, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R10寄存器失败'}), 400

        # 写入R11寄存器（行数）
        register, ret = robot_arm.register.read(11)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R11寄存器失败'}), 400
        register.value = int(rows)  # 更新值
        ret = robot_arm.register.write(11, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R11寄存器失败'}), 400

         # 写入R12寄存器（列数）
        register, ret = robot_arm.register.read(12)  # 先读取当前寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取R12寄存器失败'}), 400
        register.value = int(cols)  # 更新值
        ret = robot_arm.register.write(12, register)  # 写回寄存器
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '写入R12寄存器失败'}), 400

        return jsonify({'message': 'R寄存器写入成功'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_tf_data', methods=['POST'])
def get_tf_data():
    global robot_arm
    data = request.json
    tf_id = data.get('tf_id')

    if tf_id is None:
        return jsonify({'error': '缺少TF ID'}), 400

    if robot_arm is None:
        return jsonify({'error': '未连接机器人'}), 400

    try:
        # 读取指定TF的值
        tf, ret = robot_arm.coordinate_system.get(CoordinateSystemType.ToolFrame, tf_id)
        if ret != StatusCodeEnum.OK:
            return jsonify({'error': '读取TF数据失败'}), 400

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
        return jsonify({
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
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/update_tf_data', methods=['POST'])
def update_tf_data():
    global robot_arm
    data = request.json
    tf_updates = data.get('tf_updates')

    if not tf_updates:
        return jsonify({'error': '缺少TF更新数据'}), 400

    if robot_arm is None:
        return jsonify({'error': '未连接机器人'}), 400

    try:
        # 批量更新TF数据
        for tf_update in tf_updates:
            tf_id = tf_update['coordinate_info']['coordinate_id']
            tf, ret = robot_arm.coordinate_system.get(CoordinateSystemType.ToolFrame, tf_id)
            if ret != StatusCodeEnum.OK:
                return jsonify({'error': f'读取TF {tf_id} 数据失败'}), 400

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
                return jsonify({'error': f'更新TF {tf_id} 数据失败'}), 400

        return jsonify({'message': 'TF数据更新成功'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_pr_data', methods=['POST'])
def get_pr_data():
    data = request.json
    shape_type = data.get('shape_type')
    diameter = data.get('diameter')
    length = data.get('length')
    width = data.get('width')

    if not shape_type:
        return jsonify({'error': '缺少仿形形状类型'}), 400

    try:
        # 读取PR寄存器的值
        pr1, ret1 = robot_arm.pose_register.read(1)
        pr2, ret2 = robot_arm.pose_register.read(2)
        pr3, ret3 = robot_arm.pose_register.read(3)

        if ret1 != StatusCodeEnum.OK or ret2 != StatusCodeEnum.OK or ret3 != StatusCodeEnum.OK:
            return jsonify({'error': '读取PR寄存器失败'}), 400

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
            row_spacing = abs(pr2_y - pr1_y) - diameter
            col_spacing = abs(pr3_x - pr1_x) - diameter
            print(
                f"row_spacing：{row_spacing}\n"
                f"col_spacing：{col_spacing}\n"
            )
        elif shape_type == 'rectangle':
            row_spacing = abs(pr2_y - pr1_y) - length
            col_spacing = abs(pr3_x - pr1_x) - width
            print(
                f"row_spacing：{row_spacing}\n"
                f"col_spacing：{col_spacing}\n"
            )
        else:
            return jsonify({'error': '无效的仿形形状类型'}), 400

        return jsonify({
            'row_spacing': row_spacing,
            'col_spacing': col_spacing,
            'pr1_x': pr1_x,
            'pr1_y': pr1_y,
            'pr2_x': pr2_x,
            'pr2_y': pr2_y,
            'pr3_x': pr3_x,
            'pr3_y': pr3_y
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/save_recipe', methods=['POST'])
def save_recipe():
    data = request.json

    try:
        # 获取配方名和配方编号
        recipe_name = data.get('recipeName')
        recipe_id = data.get('recipeId')  # 获取配方编号

        if not recipe_name or not recipe_id:
            return jsonify({'error': '缺少配方名或配方编号'}), 400

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

        # 获取工件类型对应的几何参数
        circle_diameter = data.get('circleDiameter') if shape_type == 'circle' else None
        rectangle_length = data.get('rectangleLength') if shape_type == 'rectangle' else None
        rectangle_width = data.get('rectangleWidth') if shape_type == 'rectangle' else None
        polygon_sides = data.get('polygonSides') if shape_type == 'polygon' else None
        polygon_side_length = data.get('polygonSideLength') if shape_type == 'polygon' else None
        triangle_type = data.get('triangleType') if shape_type == 'triangle' else None
        triangle_side_length = data.get('triangleSideLength') if shape_type == 'triangle' else None
        triangle_base_length = data.get('triangleBaseLength') if shape_type == 'triangle' else None
        triangle_orientation = data.get('triangleOrientation') if shape_type == 'triangle' else None

        # 将数据保存到一个 JSON 文件中
        recipe_data = {
            'recipeName': recipe_name,
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
            'triangleType': triangle_type,
            'triangleSideLength': triangle_side_length,
            'triangleBaseLength': triangle_base_length,
            'triangleOrientation': triangle_orientation
        }

        # 保存到文件
        import json
        with open(f'recipes/{recipe_name}.json', 'w') as f:
            json.dump(recipe_data, f)

        return jsonify({'message': '配方保存成功'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/check_recipe', methods=['POST'])
def check_recipe():
    data = request.json

    try:
        # 获取配方名和配方编号
        recipe_name = data.get('recipeName')
        recipe_id = data.get('recipeId')  # 获取配方编号

        if not recipe_name or not recipe_id:
            return jsonify({'error': '缺少配方名或配方编号'}), 400

        # 检查配方文件是否存在
        recipe_file_path = f'recipes/{recipe_name}.json'
        exists = os.path.exists(recipe_file_path)

        # 检查配方编号是否重复
        recipe_dir = 'recipes'
        if not os.path.exists(recipe_dir):
            os.makedirs(recipe_dir)

        id_exists = False
        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    recipe_data = json.load(file)
                    if recipe_data.get('recipeId') == recipe_id:
                        id_exists = True
                        break

        return jsonify({
            'exists': exists,  # 配方名是否存在
            'id_exists': id_exists  # 配方编号是否存在
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


# app.py
import os
import json

@app.route('/get_recipe_list', methods=['GET'])
def get_recipe_list():
    """获取所有配方的列表"""
    try:
        recipe_dir = 'recipes'
        if not os.path.exists(recipe_dir):
            os.makedirs(recipe_dir)
        recipes = []
        for f in os.listdir(recipe_dir):
            if f.endswith('.json'):
                with open(os.path.join(recipe_dir, f), 'r') as file:
                    recipe_data = json.load(file)
                    recipes.append({
                        'recipeName': recipe_data.get('recipeName'),
                        'recipeId': recipe_data.get('recipeId')  # 确保返回 recipeId
                    })
        return jsonify({'recipes': recipes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/get_recipe', methods=['POST'])
def get_recipe():
    """获取指定配方的详细信息"""
    data = request.json
    recipe_name = data.get('recipeName')

    if not recipe_name:
        return jsonify({'error': '缺少配方名'}), 400

    try:
        recipe_file_path = f'recipes/{recipe_name}.json'
        if not os.path.exists(recipe_file_path):
            return jsonify({'error': '配方不存在'}), 404

        with open(recipe_file_path, 'r') as f:
            recipe_data = json.load(f)
        return jsonify(recipe_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/delete_recipe', methods=['POST'])
def delete_recipe():
    """删除指定配方"""
    data = request.json
    recipe_name = data.get('recipeName')

    if not recipe_name:
        return jsonify({'error': '缺少配方名'}), 400

    try:
        recipe_file_path = f'recipes/{recipe_name}.json'
        if not os.path.exists(recipe_file_path):
            return jsonify({'error': '配方不存在'}), 404

        os.remove(recipe_file_path)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)