import hmac
import hashlib
import base64
import sys
print base64.b64encode(hmac.new(sys.argv[1].decode("base64"), sys.argv[2], digestmod=hashlib.sha512).digest())