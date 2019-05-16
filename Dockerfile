FROM parity/parity:v2.4.6

# override the parity image's user
USER root

EXPOSE 30303 8546

ENTRYPOINT /bin/parity \
  --chain=mainnet \
  --auto-update=critical \
  --ws-port=8546 \
  --ws-interface=0.0.0.0 \
  --ws-origins=all \
  --ws-hosts=all
