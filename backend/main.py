import urllib
from flask import Flask, request, send_file
import datetime
import json
import os
import requests
from flask_cors import CORS
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten
from tensorflow.keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator

from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten
from tensorflow.keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator

# from keras.models import Sequential
# from keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten
# from tensorflow.keras.optimizers import Adam
# from keras.preprocessing.image import ImageDataGenerator

# import zipfile
# with zipfile.ZipFile("/content/drive/MyDrive/Mini Project-20220410T191130Z-001/Mini Project/dataset.zip","r") as zip_ref:
#     zip_ref.extractall("targetdir")

# from zipfile import ZipFile
# zf = ZipFile('/content/drive/MyDrive/Mini Project-20220410T191130Z-001/Mini Project/dataset.zip', 'r')
# zf.extractall('path_to_extract_folder')
# zf.close()

# #Initializing image data generator with rescaling
# train_data_gen = ImageDataGenerator(rescale=1./255)
# validation_data_gen = ImageDataGenerator(rescale=1./255)

# #Preprocess all test images
# train_generator = train_data_gen.flow_from_directory('/content/targetdir/dataset/train',
#                                                      target_size=(48,48),
#                                                      batch_size=64,
#                                                      color_mode="grayscale",
#                                                      class_mode='categorical')

# #Preprocess all train images
# validation_generator = validation_data_gen.flow_from_directory('/content/targetdir/dataset/test',
#                                                      target_size=(48,48),
#                                                      batch_size=64,
#                                                      color_mode="grayscale",
#                                                      class_mode='categorical')

# #create model structure
# emotion_model = Sequential()

# emotion_model.add(Conv2D(32, kernel_size=(3,3), activation='relu', input_shape=(48,48,1)))
# emotion_model.add(Conv2D(64, kernel_size=(3,3), activation='relu'))
# emotion_model.add(MaxPooling2D(pool_size=(2,2)))
# emotion_model.add(Dropout(0.25))

# emotion_model.add(Conv2D(128, kernel_size=(3,3), activation='relu'))
# emotion_model.add(MaxPooling2D(pool_size=(2,2)))
# emotion_model.add(Conv2D(128, kernel_size=(3,3), activation='relu'))
# emotion_model.add(MaxPooling2D(pool_size=(2,2)))
# emotion_model.add(Dropout(0.25))

# emotion_model.add(Flatten())
# emotion_model.add(Dense(1024, activation='relu'))
# emotion_model.add(Dropout(0.5))
# emotion_model.add(Dense(7, activation='softmax'))

# emotion_model.compile(loss='categorical_crossentropy', optimizer=Adam(learning_rate=0.0001, decay=1e-6), metrics=['accuracy'])

# #Training the Neural network
# emotion_model_info = emotion_model.fit_generator(
#     train_generator,
#     steps_per_epoch=28709 // 64,
#     epochs=25,
#     validation_data=validation_generator,
#     validation_steps = 7178 // 64)

# #save model stricture in jason file
# model_json = emotion_model.to_json()
# with open("emotion_model.json", "w") as json_file:
#     json_file.write(model_json)

# #save trained model weight in .h5 file
# emotion_model.save_weights('emotion_model.h5')

# emotion_model.save('saved_model/my_model')

# import os
# savedir = "/content/saved_model/my_model/variables/variables.data-00000-of-00001"
# os.mkdir(os.path.join(savedir, 'variables.data-00000-of-00001'))

# from zipfile import ZipFile
# import os

# def get_all_file_paths(directory):

# 	file_paths = []

# 	for root, directories, files in os.walk(directory):
# 		for filename in files:
# 			filepath = os.path.join(root, filename)
# 			file_paths.append(filepath)


# 	return file_paths

# def main():
# 	directory = '/content/saved_model'

# 	file_paths = get_all_file_paths(directory)

# 	print('Following files will be zipped:')
# 	for file_name in file_paths:
# 		print(file_name)

# 	with ZipFile('saved_model.zip','w') as zip:

# 		for file in file_paths:
# 			zip.write(file)

# 	print('All files zipped successfully!')

# if __name__ == "__main__":
# 	main()

import cv2
import numpy as np
from keras.models import model_from_json
from binascii import a2b_base64

emotion_dict = [
    "Angry",
    "Disgusted",
    "Fearful",
    "Happy",
    "Neutral",
    "Sad",
    "Surprised",
    "Neutral",
]

# load json and create model
json_file = open("emotion_model.json", "r")
loaded_model_json = json_file.read()
emotion_model = model_from_json(loaded_model_json)

# load weights into new model
emotion_model.load_weights("emotion_model.h5")
print("loaded model from disk")


def predict(path, tempfilename):
    img = cv2.imread(path)
    # print(img.shape)
    # print(img)
    if img.shape > (48, 48, 3):
        img = cv2.resize(img, (1080, 2400))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faceCascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        num_faces = faceCascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5)
        # print(num_faces)
        # take each face available on the camera and Preprocess it
        for (x, y, w, h) in num_faces:
            cv2.rectangle(img, (x, y - 50),
                          (x + w, y + h + 10), (0, 255, 0), 4)
            roi_gray_frame = gray[y: y + h, x: x + w]
            cropped_img = np.expand_dims(
                np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0
            )
            # plt.imshow(img)
            # Predict the emotions
            emotion_prediction = emotion_model.predict(cropped_img)
            maxindex = int(np.argmax(emotion_prediction))
            cv2.putText(
                img,
                emotion_dict[maxindex],
                (x + 5, y - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                2,
                cv2.LINE_AA,
            )
            print(img)
            cv2.imwrite(tempfilename, img)
            # with open(tempfilename, "wb") as finalFile:
            # finalFile.write(img)
            return maxindex
        else:
            gray = cv2.resize(img, (48, 48))
            faceCascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            )
        num_faces = faceCascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5)
        # take each face available on the camera and Preprocess it
        for (x, y, w, h) in num_faces:
            cv2.rectangle(img, (x, y - 50),
                          (x + w, y + h + 10), (0, 255, 0), 4)
            roi_gray_frame = gray[y: y + h, x: x + w]
            cropped_img = np.expand_dims(
                np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0
            )
            # plt.imshow(img)
            # Predict the emotions
            emotion_prediction = emotion_model.predict(cropped_img)
            maxindex = int(np.argmax(emotion_prediction))
            cv2.putText(
                img,
                emotion_dict[maxindex],
                (x + 5, y - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 0, 0),
                2,
                cv2.LINE_AA,
            )
            print(img)
            cv2.imwrite(tempfilename, img)
            # with open(tempfilename, "wb") as finalFile:
            #     finalFile.write(img)
            return maxindex


app = Flask(__name__)
CORS(app)

PORT = 5000
HOST = "localhost"
SERVER = "http:\/\/localhost:5000/img/"


@app.route("/predict", methods=["POST"])
def predictEmotion():
    timestamp = str(datetime.datetime.now().timestamp())
    filename = timestamp + ".jpg"
    tempfilename = timestamp + '_temp' + ".jpg"

    captured = request.form.get("captured")

    if request.files:
        file = request.files["file"]
        file.save(filename)
    elif captured == "true":
        data = request.form.get("imagedata")
        response = urllib.request.urlopen(data)
        with open(filename, "wb") as f:
            f.write(response.file.read())

    #         binary_data = a2b_base64(data)
    #
    #         file = open(filename, 'w')
    #         file.write(binary_data)
    #         file.close()
    else:
        return app.response_class(
            response=json.dumps({"data": "7", "code": "FAILED"}),
            status=200,
            mimetype="application/json",
        )

    result = predict(filename, tempfilename)
    # by default the mood will be neutral...
    if result == "None" or result == None:
        result = 7

    response = app.response_class(
        response=json.dumps(
            {
                "data": str(result),
                "code": "SUCCESS",
                "image": SERVER + tempfilename,
            }
        ),
        status=200,
        mimetype="application/json",
    )
    return response


@app.route("/img/<image_name>", methods=["POST", "GET"])
def getImage(image_name):
    print("request for", image_name)
    if os.path.exists(image_name):
        return send_file(image_name)
    else:
        return app.response_class(
            response=json.dumps(
                {"data": "Image not found, 404", "code": "FAILED"}),
            status=200,
            mimetype="application/json",
        )


if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=PORT)
