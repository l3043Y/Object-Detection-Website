from WebApp import create_app
import sys

app = create_app()

if __name__ == '__main__':
    args = sys.argv
    if len(args) > 1 and sys.argv[1] == 'docker':
        app.run(host='0.0.0.0',port=80)
    else:
        app.run(host='localhost',port=80)
