import arcpy 
input_features_1 = arcpy.GetParameter(0)	
input_features_2 = arcpy.GetParameter(1)
output_features = arcpy.GetParameter(2)
arcpy.Intersect_analysis ([input_features_1, input_features_2], output_features, "ALL", "", "")